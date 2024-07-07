import unittest
from pages.projects_page import ProjectsPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL

class TestProjects(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/projects")
        self.projects_page = ProjectsPage(self.driver)

    def test_create_project(self):
        self.projects_page.click_create_project_button()
        self.projects_page.enter_project_name("New Project")
        self.projects_page.click_create_project_button()
        # Add assertions to verify project creation

    def test_update_project(self):
        self.projects_page.click_update_project_button()
        self.projects_page.enter_project_name("Updated Project")
        self.projects_page.click_create_project_button()
        # Add assertions to verify project update

    def test_delete_project(self):
        self.projects_page.click_delete_project_button()
        # Add assertions to verify project deletion

    def test_view_issues(self):
        self.projects_page.click_view_issues_button()
        # Add assertions to verify navigation to issues

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
