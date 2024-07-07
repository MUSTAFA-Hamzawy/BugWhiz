import unittest
from pages.signup_page import SignupPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL

class TestSignup(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/signup")
        self.signup_page = SignupPage(self.driver)

    # Positive test cases
    # Test case 1: Signup with valid details
    def test_signup_success(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify successful signup

    # Test case 2: Signup with uppercase username
    def test_signup_with_long_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe_the_first")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify successful signup

    # Test case 3: Signup with special characters in username
    def test_signup_with_special_characters_in_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john.doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify successful signup

    # Test case 4: Signup with special characters in password
    def test_signup_with_long_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("Password" * 6)
        self.signup_page.enter_confirm_password("Password" * 6)
        self.signup_page.click_signup()
        # Add assertions to verify successful signup

    # =================================================================

    # Negative test cases
    # Test case 5: Signup with empty fullname
    def test_signup_with_empty_fullname(self):
        self.signup_page.enter_fullname("")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 6: Signup with empty username
    def test_signup_with_empty_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 7: Signup with empty email
    def test_signup_with_empty_email(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 8: Signup with empty phone
    def test_signup_with_empty_phone(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 9: Signup with empty job
    def test_signup_with_empty_job(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 10: Signup with empty password
    def test_signup_with_empty_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("")
        self.signup_page.enter_confirm_password("")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 11: Signup with empty confirm password
    def test_signup_with_mismatched_passwords(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("WrongPassword456")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 12: Signup with empty confirm password
    def test_signup_with_invalid_email_format(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@invalid")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 13: Signup with empty confirm password
    def test_signup_with_short_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("short")
        self.signup_page.enter_confirm_password("short")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 14: Signup with empty confirm password
    def test_signup_with_duplicate_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("existing_user")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 15: Signup with empty confirm password
    def test_signup_with_duplicate_email(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("existing.email@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 16: Signup with empty confirm password
    def test_signup_with_sql_injection(self):
        self.signup_page.enter_fullname("John Doe';--")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 17: Signup with empty confirm password
    def test_signup_with_xss_attack(self):
        self.signup_page.enter_fullname("<script>alert('XSS')</script>")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 18: Signup with empty confirm password
    def test_signup_with_unicode_characters_in_fullname(self):
        self.signup_page.enter_fullname("测试用户")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 19: Signup with empty confirm password
    def test_signup_with_unicode_characters_in_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("测试用户")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 20: Signup with empty confirm password
    def test_signup_with_max_length_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("a" * 256)
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 21: Signup with empty confirm password
    def test_signup_with_max_length_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("a" * 256)
        self.signup_page.enter_confirm_password("a" * 256)
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Test case 22: Signup with empty confirm password
    def test_signup_with_html_injection_in_fullname(self):
        self.signup_page.enter_fullname("<div>John Doe</div>")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        # Add assertions to verify unsuccessful signup

    # Quit the browser after running the test
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
