import unittest
from pages.signup_page import SignupPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestSignup(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/signup")
        self.signup_page = SignupPage(self.driver)



    '''
    def test_navigate_to_signup(self):
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Positive test cases
    # Test case 1: Signup with valid details
    def test_signup_success(self):
        self.signup_page.enter_fullname("KarimMa")
        self.signup_page.enter_username("karimmohamed9")
        self.signup_page.enter_email("karimmohamed9@gmail.com")
        self.signup_page.enter_phone("01113162158")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("Karim123")
        self.signup_page.enter_confirm_password("Karim123")
        self.signup_page.click_signup()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")        
        self.signup_page.enter_username_login("karimmohamed005")
        self.signup_page.enter_password_login("Karim123")
        self.signup_page.click_login_button()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.assertEqual("Projects - BugWhiz", self.driver.title)
    
    # =================================================================

    # Negative test cases
    # Test case 2: Signup with empty fields
    def test_signup_with_empty_fields(self):
        self.signup_page.enter_fullname("")
        self.signup_page.enter_username("")
        self.signup_page.enter_email("")
        self.signup_page.enter_phone("")
        self.signup_page.enter_job("")
        self.signup_page.enter_password("")
        self.signup_page.enter_confirm_password("")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_fullname_error(), "Full Name is required.")
        self.assertEqual(self.signup_page.get_username_error(), "Username is required.")
        self.assertEqual(self.signup_page.get_email_error(), "Email is required.")
        self.assertEqual(self.signup_page.get_phone_error(), "Phone Number is required.")
        self.assertEqual(self.signup_page.get_job_error(), "Job Title is required.")
        self.assertEqual(self.signup_page.get_password_error(), "Password is required.")
        self.assertEqual(self.signup_page.get_confirm_password_error(), "Confirm Password is required.")
        
    # Test case 3: Signup with empty fullname
    def test_signup_with_empty_fullname(self):
        self.signup_page.enter_fullname("")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_fullname_error(), "Full Name is required.")

    # Test case 4: Signup with empty username
    def test_signup_with_empty_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_username_error(), "Username is required.")

    # Test case 5: Signup with empty email
    def test_signup_with_empty_email(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_email_error(), "Email is required.")

    # Test case 6: Signup with empty phone
    def test_signup_with_empty_phone(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_phone_error(), "Phone Number is required.")

    # Test case 7: Signup with empty job
    def test_signup_with_empty_job(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_job_error(), "Job Title is required.")

    # Test case 8: Signup with empty password
    def test_signup_with_empty_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("")
        self.signup_page.enter_confirm_password("")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_password_error(), "Password is required.")
        self.assertEqual(self.signup_page.get_confirm_password_error(), "Confirm Password is required.")

    # Test case 9: Signup with empty confirm password
    def test_signup_with_mismatched_passwords(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("12")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_confirm_password_mismatch_error(), "Passwords don't match.")

    # Test case 10: Signup with empty confirm password
    def test_signup_with_invalid_email_format(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@invalid")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_email_invalid_error(), "This email is invalid.")

    # Test case 11: Signup with short password
    def test_signup_with_short_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("sho")
        self.signup_page.enter_confirm_password("sho")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)
        self.assertEqual(self.signup_page.get_password_short_error(), "Password is not strong enough.")        

    # Test case 12: Signup with SQL injection
    def test_signup_with_sql_injection(self):
        self.signup_page.enter_fullname("John Doe';--")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 13: Signup with XSS attack
    def test_signup_with_xss_attack(self):
        self.signup_page.enter_fullname("<script>alert('XSS')</script>")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 14: Signup with unicode characters in fullname
    def test_signup_with_unicode_characters_in_fullname(self):
        self.signup_page.enter_fullname("测试用户")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 15: Signup with unicode characters in username
    def test_signup_with_unicode_characters_in_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("测试用户")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 16: Signup with max length username
    def test_signup_with_max_length_username(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("a" * 256)
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("John123")
        self.signup_page.enter_confirm_password("John123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 17: Signup with max length password
    def test_signup_with_max_length_password(self):
        self.signup_page.enter_fullname("John Doe")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("01113162153")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("a" * 256)
        self.signup_page.enter_confirm_password("a" * 256)
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    # Test case 18: Signup with HTML injection in fullname
    def test_signup_with_html_injection_in_fullname(self):
        self.signup_page.enter_fullname("<div>John Doe</div>")
        self.signup_page.enter_username("john_doe")
        self.signup_page.enter_email("john.doe@example.com")
        self.signup_page.enter_phone("1234567890")
        self.signup_page.enter_job("Engineer")
        self.signup_page.enter_password("JohnPassword123")
        self.signup_page.enter_confirm_password("JohnPassword123")
        self.signup_page.click_signup()
        self.assertEqual(self.driver.current_url, BASE_URL + "/signup")
        self.assertEqual("Sign UP - BugWhiz", self.driver.title)

    '''

    # Quit the browser after running the test
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
