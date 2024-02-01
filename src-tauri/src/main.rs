// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, Submenu};

#[tokio::main]
async fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    let menu = Menu::new()
        // .add_native_item(MenuItem::Zoom)
        // .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "close" => {
                std::process::exit(0);
            }
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
