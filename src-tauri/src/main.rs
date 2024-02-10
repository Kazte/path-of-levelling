// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

#[tokio::main]
async fn main() {
    // create the system tray
    let open_app = CustomMenuItem::new("open_app".to_string(), "Open App");
    let quit_app = CustomMenuItem::new("quit_app".to_string(), "Quit App");
    let tray_menu = SystemTrayMenu::new()
        .add_item(open_app)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit_app);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open_app" => {
                    app.get_window("main").unwrap().show().unwrap();

                    // send event to the frontend
                    app.emit_all::<()>("showWindow", {}).unwrap();
                }
                "quit_app" => {
                    app.exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![get_area_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn get_area_name(file_location: &str) -> Result<String, String> {
    let file = async_fs::read_to_string(file_location).await;

    if file.is_err() {
        return Err("Error while reading file".to_string());
    }

    let file = file.unwrap();

    let mut area_name = String::new();

    for line in file.lines().rev() {
        if line.contains("Generating level") {
            area_name = line.split("Generating level").collect::<Vec<&str>>()[1]
                .split(' ')
                .collect::<Vec<&str>>()[3]
                .trim()
                .replace("\"", "")
                .to_string();
            break;
        }
    }

    Ok(area_name)
}
