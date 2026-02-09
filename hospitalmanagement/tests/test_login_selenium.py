from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time

# NOTE: Ensure you have 'selenium' installed and the appropriate WebDriver (e.g., chromedriver) for your browser.
# pip install selenium

def test_hospital_login():
    driver = webdriver.Chrome() # Or webdriver.Firefox(), webdriver.Edge()
    
    try:
        print("🚀 Starting Login Page Automation Test...")
        driver.get("http://localhost:3000/admin/login")
        driver.maximize_window()
        time.sleep(2)

        # ----------------------------------------------------------------
        # Test Case 1: Admin Login (Success)
        # ----------------------------------------------------------------
        print("\n🧪 [Test 1] Verifying ADMIN Login...")
        
        # 1. Select Role
        role_select = Select(driver.find_element(By.TAG_NAME, "select"))
        role_select.select_by_visible_text("Admin")
        
        # 2. Enter Username
        username_input = driver.find_element(By.XPATH, "//input[@type='text']")
        username_input.clear()
        username_input.send_keys("admin")
        
        # 3. Enter Password
        password_input = driver.find_element(By.XPATH, "//input[@type='password']")
        password_input.clear()
        password_input.send_keys("admin123")
        
        # 4. Click Login
        login_btn = driver.find_element(By.XPATH, "//button[text()='Login']")
        login_btn.click()
        
        time.sleep(3)
        
        if "admin-dashboard" in driver.current_url:
            print("✅ PASS: Admin redirected to Admin Dashboard")
        else:
            print(f"❌ FAIL: Admin not redirected correctly. Current URL: {driver.current_url}")
            
        # Logout (or go back for next test)
        driver.get("http://localhost:3000/admin/login")
        time.sleep(2)

        # ----------------------------------------------------------------
        # Test Case 2: Role Mismatch (Fail)
        # ----------------------------------------------------------------
        print("\n🧪 [Test 2] Verifying Role Mismatch (Doctor Role + Admin Creds)...")
        
        # 1. Select Wrong Role
        role_select = Select(driver.find_element(By.TAG_NAME, "select"))
        role_select.select_by_visible_text("Doctor")
        
        # 2. Enter Admin Credentials
        driver.find_element(By.XPATH, "//input[@type='text']").send_keys("admin")
        driver.find_element(By.XPATH, "//input[@type='password']").send_keys("admin123")
        
        # 3. Click Login
        driver.find_element(By.XPATH, "//button[text()='Login']").click()
        time.sleep(1)
        
        # 4. Check for Error
        page_source = driver.page_source
        if "Access Denied" in page_source:
             print("✅ PASS: Role mismatch error displayed")
        else:
             print("❌ FAIL: No error message for role mismatch")

    except Exception as e:
        print(f"❌ ERROR: {e}")
    finally:
        driver.quit()
        print("\n🏁 Automation Test Finished.")

if __name__ == "__main__":
    test_hospital_login()
