import unittest
from pages.issues_page import IssuesPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner

class TestIssues(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.get(BASE_URL + "/issues")
        self.projects_page = IssuesPage(self.driver)

    def test_navigate_to_issues_page(self):
        self.assertEqual("Issues - BugWhiz", self.driver.title)
                

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
