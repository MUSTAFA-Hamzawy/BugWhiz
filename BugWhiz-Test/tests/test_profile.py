import unittest
from pages.projects_page import ProjectsPage
from pages.login_page import LoginPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner

class TestProjects(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)
        self.login_page.login()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.projects_page = ProjectsPage(self.driver)


    def test_navigate_to_projects_page(self):
        self.assertEqual("Projects - BugWhiz", self.driver.title)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
