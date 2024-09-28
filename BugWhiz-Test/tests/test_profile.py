import unittest
from pages.projects_page import ProjectsPage
from pages.profile_page import ProfilePage
from pages.login_page import LoginPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestProfile(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)
        self.login_page.login()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.projects_page = ProjectsPage(self.driver)
        self.driver.get(BASE_URL + "/profile")
        self.profile_page = ProfilePage(self.driver)
        time.sleep(2)

    '''

    def test0_navigate_to_profile_page(self):
        self.assertEqual("Profile - BugWhiz", self.driver.title)

    # Test case 1: click on logo should redirect to projects page
    def test_click_logo(self):
        self.profile_page.click_logo()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")

    # Test case 2: click on projects tab should redirect to projects page
    def test_click_projects_tab(self):
        self.profile_page.click_projects_tab()
        self.assertEqual(self.driver.current_url, BASE_URL + "/Projects")

    # Test case 3: click on logout button should redirect to login page
    def test_click_logout_button(self):
        self.profile_page.click_logout_button()
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 4: get name should return the name of the user
    def test_get_name(self):
        self.assertEqual(self.profile_page.get_name(), "KarimMahmoud")

    # Test case 5: get email should return the email of the user
    def test_get_email(self):
        self.assertEqual(self.profile_page.get_email(), "karimmohamed003@gmail.com")

    # Test case 6: get user name should return the user name of the user
    def test_get_user_name(self):
        self.assertEqual(self.profile_page.get_user_name(), "karimmohamed003")

    # Test case 7: get phone number should return the phone number of the user
    def test_get_phone_number(self):
        self.assertEqual(self.profile_page.get_phone_number(), "01558446250")

    # Test case 8: get job title should return the job title of the user
    def test_get_job_title(self):
        self.assertEqual(self.profile_page.get_job_title(), "Student")

    # Test case 9: click on notifications tab should redirect to notifications page
    def test_click_notifications_tab(self):
        self.profile_page.click_notifications_tab()
        self.assertEqual(self.driver.current_url, BASE_URL + "/notifications")

    '''

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
