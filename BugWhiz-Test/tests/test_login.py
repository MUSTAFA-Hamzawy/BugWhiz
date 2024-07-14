import unittest
from pages.login_page import LoginPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestLogin(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)

    '''

    # Validate the Login page tab title
    def test_login_tab_title(self):
        self.assertEqual("Login - BugWhiz", self.driver.title)

    # Positive test cases
    # Test case 1: Login with valid username and password
    def test_login_success(self):
        self.login_page.enter_username("karimmohamed003")
        self.login_page.enter_password("Karim123")
        self.login_page.click_login()
        # Add assertions to verify successful login
        time.sleep(2)
        self.assertEqual("Projects - BugWhiz", self.driver.title)

    # =============================================================
    
    # Negative test cases
    # Test case 2: Login with invalid username
    def test_login_invalid_username(self):
        self.login_page.enter_username("jane_doe")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 3: Login with invalid password
    def test_login_invalid_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password("WrongPassword456")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 4: Login with invalid username and password
    def test_login_empty_username(self):
        self.login_page.enter_username("")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 5: Login with empty password
    def test_login_empty_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password("")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 6: Login with empty username and password
    def test_login_empty_username_and_password(self):
        self.login_page.enter_username("")
        self.login_page.enter_password("")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 7: Login with SQL injection
    def test_login_sql_injection(self):
        self.login_page.enter_username("john_doe';--")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 8: Login with XSS attack
    def test_login_xss_attack(self):
        self.login_page.enter_username("<script>alert('XSS')</script>")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 9: Login with HTML injection
    def test_login_with_spaces_in_username(self):
        self.login_page.enter_username(" john_doe ")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 10: Login with spaces in password
    def test_login_with_spaces_in_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password(" JohnPassword123 ")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 11: Login with leading and trailing spaces in username
    def test_login_with_special_characters_in_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password("John$Password!")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 12: Login with leading and trailing spaces in password
    def test_login_with_unicode_characters_in_username(self):
        self.login_page.enter_username("测试用户")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 13: Login with unicode characters in password
    def test_login_with_unicode_characters_in_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password("密码测试")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 14: Login with leading and trailing spaces in username and password
    def test_login_with_max_length_username(self):
        self.login_page.enter_username("a" * 256)
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 15: Login with maximum length password
    def test_login_with_max_length_password(self):
        self.login_page.enter_username("john_doe")
        self.login_page.enter_password("a" * 256)
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 16: Login with HTML injection in username
    def test_login_with_html_injection_in_username(self):
        self.login_page.enter_username("<div>john_doe</div>")
        self.login_page.enter_password("JohnPassword123")
        self.login_page.click_login()
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")
    
    '''

    # Quit the browser
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
