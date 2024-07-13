import unittest
from pages.projects_page import ProjectsPage
from pages.login_page import LoginPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestProjects(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)
        self.login_page.login()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.projects_page = ProjectsPage(self.driver)



    '''
    def test_navigate_to_projects_page(self):
        self.assertEqual("Projects - BugWhiz", self.driver.title)

    # Test case 1: Create a project (comment it)
    def test_create_project(self):
        self.projects_page.click_create_project_button()
        self.driver.refresh()
        time.sleep(1)
        self.projects_page.enter_project_name("Project 1", "1")
        time.sleep(1)
        self.projects_page.click_submit_project_name_button()
        time.sleep(1)
        self.assertEqual("Project 1", self.projects_page.get_project_name("1"))


    # Test case 1: Cancel a project
    def test_cancel_project(self):
        self.projects_page.click_create_project_button()
        self.driver.refresh()
        self.projects_page.click_cancel_project_name_button()
        time.sleep(1)
        self.assertEqual("sprint2", self.projects_page.get_project_name())    

    # Test case 2: Update a project with cancel
    def test_update_project(self):
        self.projects_page.click_update_project_button()
        self.driver.refresh()
        self.projects_page.enter_update_project_field("new Project 1")
        self.projects_page.click_cancel_update_project_button()
        time.sleep(1)
        self.assertNotEqual("sprint2", self.projects_page.get_project_name())

    # Test case 3: Update a project with submit
    def test_update_project(self):
        self.projects_page.click_update_project_button()
        time.sleep(1)
        self.projects_page.enter_update_project_field("new sprint2")
        time.sleep(1)
        self.projects_page.click_submit_update_project_button()
        time.sleep(1)
        self.assertEqual("new sprint2", self.projects_page.get_project_name())

    # Test case 4: Click on view issues button
    def test_view_issues(self):
        self.projects_page.click_view_issues_button()
        time.sleep(1)
        self.assertEqual("Issues - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/issues")

    # Test case 5: Create 6 projects (comment it)
    def test_create_projects(self):
        for i in range(2, 8):
            self.projects_page.click_create_project_button()
            self.projects_page.enter_project_name(f"Project {i}", str(i))
            self.projects_page.click_submit_project_name_button()
            time.sleep(1)
        self.assertEqual("Project 7", self.projects_page.get_first_project_name())
        self.assertEqual("1", self.projects_page.get_page_number())
    
    # Test case 6: Navigate to page 2 
    def test_navigate_to_page_2(self):
        self.projects_page.click_next_page_button()
        time.sleep(1)
        self.assertEqual("2", self.projects_page.get_page_number())
        self.assertEqual("sprint13", self.projects_page.get_project_name())

    # Test case 7: Navigate to page 1
    def test_navigate_to_page_1(self):
        self.projects_page.click_next_page_button()
        self.projects_page.click_previous_page_button()
        time.sleep(1)
        self.assertEqual("1", self.projects_page.get_page_number())
        self.assertEqual("new sprint2", self.projects_page.get_project_name())

    # Test case 8: Add user to project with cancel
    def test_add_user_to_project(self):
        self.projects_page.enter_add_user_to_project_field("test")
        self.projects_page.click_clear_user_from_project_field()
        time.sleep(1)
        self.assertEqual( "" , self.projects_page.user_from_project_field_is_cleared())

    # Test case 9: Add user to project ( user not found)
    def test_add_user_to_project(self):
        self.projects_page.enter_add_user_to_project_field("test")
        self.projects_page.click_add_user_to_project_button()
        time.sleep(1)
        self.assertEqual("User not found", self.projects_page.get_user_not_found_text())
        
    # Test case 10: Add user to project ( user already assigned to project)
    def test_add_user_to_project(self):
        self.projects_page.enter_add_user_to_project_field("test")
        self.projects_page.click_add_user_to_project_button()
        time.sleep(1)
        self.assertEqual("User already assigned to this project", self.projects_page.get_user_already_assigned_to_project_text())

    # Test case 11: Add user to project ( user added successfully)
    def test_add_user_to_project(self):
        self.projects_page.enter_add_user_to_project_field("Ali")
        self.projects_page.click_add_user_to_project_button()
        time.sleep(1)
        self.assertEqual( "" , self.projects_page.user_from_project_field_is_cleared())

    # Test case 12: Navigate to analytics page
    def test_navigate_to_analytics_page(self):
        self.projects_page.click_analytics_button()
        time.sleep(1)
        self.assertEqual("Analytics - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/analytics")

    # Test case 13: Navigate to project page
    def test_navigate_to_project_page(self):
        self.projects_page.navigate_to_project()
        time.sleep(1)
        self.assertEqual("Issues - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/issues")

    # Test case 14: Logout
    def test_logout(self):
        self.projects_page.click_logout_button()
        time.sleep(1)
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 15: Navigate to previous page from browser after logout
    def test_navigate_to_previous_page_from_browser(self):
        self.projects_page.click_logout_button()
        time.sleep(1)
        self.driver.back()
        time.sleep(1)
        self.assertEqual("Login - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/login")

    # Test case 16: Delete project with cancel
    def test_delete_project(self):
        self.projects_page.click_delete_project_button()
        self.projects_page.click_cancel_delete_project_button()
        time.sleep(1)
        self.assertEqual("new sprint2", self.projects_page.get_project_name())

    # Test case 17: Navigate to notifcations page
    def test_navigate_to_notifications_page(self):
        self.projects_page.click_notification_button()
        time.sleep(1)
        self.assertEqual( self.projects_page.get_first_notification(), "You are assigned by Hazem Mohamed to work on ticket:tickte11")

    # Test case 18: Navigate to account page
    def test_navigate_to_account_page(self):
        self.projects_page.click_account_info_button()
        self.driver.get(BASE_URL + "/profile")
        time.sleep(1)
        self.assertEqual("Profile - BugWhiz", self.driver.title)
        self.assertEqual(self.driver.current_url, BASE_URL + "/profile")

    # Test case 19: Delete project with submit
    def test_delete_project(self):
        self.projects_page.click_delete_project_button()
        self.projects_page.click_confirm_delete_project_button()
        time.sleep(1)
        self.assertNotEqual("sprint4", self.projects_page.get_project_name())
        
    '''

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
