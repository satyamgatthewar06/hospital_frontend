import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;

public class TestLogin {

    public static void main(String[] args) {
        // Set the path to your ChromeDriver executable
        // System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");

        // Initialize WebDriver
        WebDriver driver = new ChromeDriver();

        try {
            System.out.println("🚀 Starting Selenium Java Test...");

            // 1. Navigate to the Login Page
            driver.get("http://localhost:3000/admin/login");
            driver.manage().window().maximize();
            Thread.sleep(2000); // Wait for page to load

            // 2. Select Role 'Admin'
            WebElement roleDropdown = driver.findElement(By.tagName("select"));
            Select selectRole = new Select(roleDropdown);
            selectRole.selectByVisibleText("Admin");
            System.out.println("✅ Role 'Admin' selected.");

            // 3. Enter Credentials
            WebElement usernameInput = driver.findElement(By.xpath("//input[@placeholder='Enter username']"));
            usernameInput.sendKeys("admin");

            WebElement passwordInput = driver.findElement(By.xpath("//input[@placeholder='Enter password']"));
            passwordInput.sendKeys("admin123");

            // 4. Click Login Button
            WebElement loginButton = driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
            loginButton.click();

            // 5. Wait and Verify Redirection
            Thread.sleep(3000); // Wait for navigation

            String currentUrl = driver.getCurrentUrl();
            if (currentUrl.contains("admin-dashboard")) {
                System.out.println("✅ PASS: Successfully redirected to Admin Dashboard.");
            } else {
                System.out.println("❌ FAIL: Redirected to " + currentUrl);
            }

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Close the browser
            System.out.println("🏁 Test Finished. Closing browser...");
            driver.quit();
        }
    }
}
