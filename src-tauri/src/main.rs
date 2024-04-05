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
        .invoke_handler(tauri::generate_handler![
            get_area_name,
            check_client_txt,
            check_poe_window,
            open_poe_window,
            open_layout_window,
            close_layout_window
        ])
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

#[tauri::command]
async fn check_client_txt(file_location: &str) -> Result<bool, String> {
    let file = async_fs::read_to_string(file_location).await;

    if file.is_err() {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command]
fn check_poe_window() -> Result<bool, String> {
    if let Ok(windows) = windows::enumerate_windows() {
        for window in windows {
            if window.title.contains("Path of Exile") {
                return Ok(true);
            }
        }
    }

    Ok(false)
}

#[tauri::command]
fn open_poe_window() -> Result<bool, String> {
    let window_found = if let Ok(windows) = windows::enumerate_windows() {
        for window in windows {
            if window.title == "Path of Exile" {
                if let Err(err) = windows::bring_to_front(window.hwnd) {
                    eprintln!("Failed to maximize window: {}", err);
                    return Ok(false);
                }
                return Ok(true);
            }
        }
        false
    } else {
        false
    };

    Ok(window_found)
}

#[cfg(target_os = "windows")]
mod windows {
    use std::ffi::OsString;
    use std::os::windows::ffi::OsStringExt;
    use winapi;
    use winapi::shared::minwindef::BOOL;
    use winapi::shared::minwindef::LPARAM;
    use winapi::shared::windef::HWND;
    use winapi::um::winuser::SetForegroundWindow;
    use winapi::um::winuser::ShowWindow;
    use winapi::um::winuser::SW_MAXIMIZE;
    use winapi::um::winuser::{EnumWindows, GetWindowTextW, IsWindowVisible}; // Add this line to import the winapi crate

    // Structure to represent window information
    #[derive(Debug)]
    pub struct WindowInfo {
        pub hwnd: HWND,
        pub title: String,
    }

    pub fn enumerate_windows() -> Result<Vec<WindowInfo>, String> {
        let mut windows = Vec::new();
        unsafe {
            EnumWindows(
                Some(enum_windows_proc),
                &mut windows as *mut Vec<WindowInfo> as _,
            );
        }
        Ok(windows)
    }

    unsafe extern "system" fn enum_windows_proc(hwnd: HWND, windows: LPARAM) -> BOOL {
        let mut buf = [0u16; 512];
        let len = GetWindowTextW(hwnd, buf.as_mut_ptr(), buf.len() as i32);
        if len > 0 && IsWindowVisible(hwnd) != 0 {
            let title = OsString::from_wide(&buf[..len as usize])
                .into_string()
                .unwrap();
            let windows_vec = &mut *(windows as *mut Vec<WindowInfo>);
            windows_vec.push(WindowInfo { hwnd, title });
        }
        1 // Continue enumeration
    }

    #[allow(dead_code)]
    pub fn maximize_window(hwnd: HWND) -> Result<(), String> {
        unsafe {
            if ShowWindow(hwnd, SW_MAXIMIZE) == 0 {
                return Err("Failed to maximize window".to_string());
            }
        }
        Ok(())
    }

    pub fn bring_to_front(hwnd: HWND) -> Result<(), String> {
        unsafe {
            if SetForegroundWindow(hwnd) == 0 {
                return Err("Failed to bring window to front".to_string());
            }
        }
        Ok(())
    }
}

#[tauri::command]
async fn open_layout_window(handle: tauri::AppHandle) -> Result<bool, String> {
    let layout_map_window = tauri::WindowBuilder::new(
        &handle,
        "layout-map", /* the unique window label */
        tauri::WindowUrl::App("index.html/#/layoutmap".parse().unwrap()),
    )
    .build();

    if layout_map_window.is_err() {
        return Ok(false);
    }

    let layout_map_window = layout_map_window.unwrap();

    layout_map_window.set_resizable(false).unwrap();
    layout_map_window.set_decorations(false).unwrap();
    layout_map_window.set_always_on_top(true).unwrap();
    layout_map_window.set_skip_taskbar(true).unwrap();
    // layout_map_window.set_ignore_cursor_events(true).unwrap();

    Ok(true)
}

#[tauri::command]
fn close_layout_window(handle: tauri::AppHandle) {
    let layout_map_window = handle.get_window("layout-map").unwrap();

    layout_map_window.close().unwrap();
}
