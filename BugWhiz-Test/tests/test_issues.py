import unittest
from pages.issues_page import IssuesPage
from pages.login_page import LoginPage
from pages.issue_details_page import IssueDetailsPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestIssues(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.maximize_window()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)
        self.login_page.login()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.issues_page = IssuesPage(self.driver)
        self.issues_page.navigate_to_issues_page()
        self.issue_details_page = IssueDetailsPage(self.driver)

    '''
    def test0_navigate_to_issues_page(self):
        self.assertEqual("Issues - BugWhiz", self.driver.title)


    # Test case 1: Validate the name of the issue 1
    def test1_issue1_name(self):
        time.sleep(1)
        self.assertEqual("Issue Name 1", self.issues_page.get_issue1_name())

    # Test case 2: Validate the title of the issue 1
    def test2_issue1_title(self):
        time.sleep(1)
        self.assertEqual("Issue Title 1", self.issues_page.get_issue1_title())

    # Test case 3: Validate the status of the issue 1
    def test3_issue1_status(self):
        time.sleep(1)
        self.assertEqual("TODO", self.issues_page.get_issue1_status())

    # Test case 4: Validate the priority of the issue 1
    def test4_issue1_priority(self):
        time.sleep(1)
        self.assertEqual("P1", self.issues_page.get_issue1_priority())

    # Test case 5: Validate the category of the issue 1
    def test5_issue1_category(self):
        time.sleep(1)
        self.assertEqual("Frontend", self.issues_page.get_issue1_category())

    # Test case 6: Validate the name of the issue 2
    def test6_issue2_name(self):
        time.sleep(1)
        self.assertEqual("Issue Name 2", self.issues_page.get_issue2_name())

    # Test case 7: Validate the title of the issue 2
    def test7_issue2_title(self):
        time.sleep(1)
        self.assertEqual("Issue Title 2", self.issues_page.get_issue2_title())

    # Test case 8: Validate the status of the issue 2
    def test8_issue2_status(self):
        time.sleep(1)
        self.assertEqual("In Progress", self.issues_page.get_issue2_status())

    # Test case 9: Validate the priority of the issue 2
    def test9_issue2_priority(self):
        time.sleep(1)
        self.assertEqual("P2", self.issues_page.get_issue2_priority())

    # Test case 10: Validate the category of the issue 2
    def test10_issue2_category(self):
        time.sleep(1)
        self.assertEqual("Backend", self.issues_page.get_issue2_category())

    # Test case 11: Validate the name of the issue 3
    def test11_issue3_name(self):
        time.sleep(1)
        self.assertEqual("Issue Name 3", self.issues_page.get_issue3_name())

    # Test case 12: Validate the title of the issue 3
    def test12_issue3_title(self):
        time.sleep(1)
        self.assertEqual("Issue Title 3", self.issues_page.get_issue3_title())

    # Test case 13: Validate the status of the issue 3
    def test13_issue3_status(self):
        time.sleep(1)
        self.assertEqual("Done", self.issues_page.get_issue3_status())

    # Test case 14: Validate the priority of the issue 3
    def test14_issue3_priority(self):
        time.sleep(1)
        self.assertEqual("P3", self.issues_page.get_issue3_priority())

    # Test case 15: Validate the category of the issue 3
    def test15_issue3_category(self):
        time.sleep(1)
        self.assertEqual("Security", self.issues_page.get_issue3_category())

    # Test case 16: Validate the name of the issue 4
    def test16_issue4_name(self):
        time.sleep(1)
        self.assertEqual("Issue Name 4", self.issues_page.get_issue4_name())
    
    # Test case 17: Validate the title of the issue 4
    def test17_issue4_title(self):
        time.sleep(1)
        self.assertEqual("Issue Title 4", self.issues_page.get_issue4_title())

    # Test case 18: Validate the status of the issue 4
    def test18_issue4_status(self):
        time.sleep(1)
        self.assertEqual("Done", self.issues_page.get_issue4_status())

    # Test case 19: Validate the priority of the issue 4
    def test19_issue4_priority(self):
        time.sleep(1)
        self.assertEqual("P4", self.issues_page.get_issue4_priority())

    # Test case 20: Validate the category of the issue 4
    def test20_issue4_category(self):
        time.sleep(1)
        self.assertEqual("Documentation", self.issues_page.get_issue4_category())

    # Test case 21: Search for an issue with status "TODO"
    def test21_search_for_todo_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_status("TODO")
        time.sleep(1)
        self.issues_page.click_search_button()
        self.assertEqual("Issue Name 1", self.issues_page.get_issue1_name())
        self.assertEqual("Issue Title 1", self.issues_page.get_issue1_title())
        self.assertEqual("TODO", self.issues_page.get_issue1_status())
        self.assertEqual("P1", self.issues_page.get_issue1_priority())
        self.assertEqual("Frontend", self.issues_page.get_issue1_category())

    # Test case 22: Search for an issue with status "In Progress"
    def test22_search_for_in_progress_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_status("IN PROGRESS")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 2", self.issues_page.get_issue2_name())
        self.assertEqual("Issue Title 2", self.issues_page.get_issue2_title())
        self.assertEqual("In Progress", self.issues_page.get_issue2_status())
        self.assertEqual("P2", self.issues_page.get_issue2_priority())
        self.assertEqual("Backend", self.issues_page.get_issue2_category())

    # Test case 23: Search for an issue with status "Done"
    def test23_search_for_done_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_status("DONE")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 3", self.issues_page.get_issue3_name())
        self.assertEqual("Issue Title 3", self.issues_page.get_issue3_title())
        self.assertEqual("Done", self.issues_page.get_issue3_status())
        self.assertEqual("P3", self.issues_page.get_issue3_priority())
        self.assertEqual("Security", self.issues_page.get_issue3_category())

    # Test case 24: Search for an issue with priority "P1"
    def test24_search_for_p1_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_priority("P1")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 1", self.issues_page.get_issue1_name())
        self.assertEqual("Issue Title 1", self.issues_page.get_issue1_title())
        self.assertEqual("TODO", self.issues_page.get_issue1_status())
        self.assertEqual("P1", self.issues_page.get_issue1_priority())
        self.assertEqual("Frontend", self.issues_page.get_issue1_category())

    # Test case 25: Search for an issue with priority "P2"
    def test25_search_for_p2_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_priority("P2")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 2", self.issues_page.get_issue2_name())
        self.assertEqual("Issue Title 2", self.issues_page.get_issue2_title())
        self.assertEqual("In Progress", self.issues_page.get_issue2_status())
        self.assertEqual("P2", self.issues_page.get_issue2_priority())
        self.assertEqual("Backend", self.issues_page.get_issue2_category())

    # Test case 26: Search for an issue with priority "P3"
    def test26_search_for_p3_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_priority("P3")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 3", self.issues_page.get_issue3_name())
        self.assertEqual("Issue Title 3", self.issues_page.get_issue3_title())
        self.assertEqual("Done", self.issues_page.get_issue3_status())
        self.assertEqual("P3", self.issues_page.get_issue3_priority())
        self.assertEqual("Security", self.issues_page.get_issue3_category())

    # Test case 27: Search for an issue with priority "P4"
    def test27_search_for_p4_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_priority("P4")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 4", self.issues_page.get_issue4_name())
        self.assertEqual("Issue Title 4", self.issues_page.get_issue4_title())
        self.assertEqual("Done", self.issues_page.get_issue4_status())
        self.assertEqual("P4", self.issues_page.get_issue4_priority())
        self.assertEqual("Documentation", self.issues_page.get_issue4_category())

    # Test case 28: Search for an issue with category "Frontend"
    def test28_search_for_frontend_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_category("Frontend")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 1", self.issues_page.get_issue1_name())
        self.assertEqual("Issue Title 1", self.issues_page.get_issue1_title())
        self.assertEqual("TODO", self.issues_page.get_issue1_status())
        self.assertEqual("P1", self.issues_page.get_issue1_priority())
        self.assertEqual("Frontend", self.issues_page.get_issue1_category())

    # Test case 29: Search for an issue with category "Backend"
    def test29_search_for_backend_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_category("Backend")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 2", self.issues_page.get_issue2_name())
        self.assertEqual("Issue Title 2", self.issues_page.get_issue2_title())
        self.assertEqual("In Progress", self.issues_page.get_issue2_status())
        self.assertEqual("P2", self.issues_page.get_issue2_priority())
        self.assertEqual("Backend", self.issues_page.get_issue2_category())

    # Test case 30: Search for an issue with category "Security"
    def test30_search_for_security_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_category("Security")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 3", self.issues_page.get_issue3_name())
        self.assertEqual("Issue Title 3", self.issues_page.get_issue3_title())
        self.assertEqual("Done", self.issues_page.get_issue3_status())
        self.assertEqual("P3", self.issues_page.get_issue3_priority())
        self.assertEqual("Security", self.issues_page.get_issue3_category())

    # Test case 31: Search for an issue with category "Documentation"
    def test31_search_for_documentation_issue(self):
        self.issues_page.search_issue("Issue")
        time.sleep(1)
        self.issues_page.search_issue_by_category("Documentation")
        time.sleep(1)
        self.issues_page.click_search_button()
        time.sleep(1)
        self.assertEqual("Issue Name 4", self.issues_page.get_issue4_name())
        self.assertEqual("Issue Title 4", self.issues_page.get_issue4_title())
        self.assertEqual("Done", self.issues_page.get_issue4_status())
        self.assertEqual("P4", self.issues_page.get_issue4_priority())
        self.assertEqual("Documentation", self.issues_page.get_issue4_category())

    # Test case 32: Create issue and Cancel
    def test32_create_issue_cancel(self):
        self.issues_page.navigate_to_create_issue_page()
        self.issues_page.add_issue_name("Issue Name 5")
        self.issues_page.add_issue_title("Issue Title 5")
        time.sleep(1)
        self.issues_page.add_issue_description("Issue Description 5")
        self.issues_page.click_cancel_button()
        time.sleep(1)
        self.assertEqual("Issues - BugWhiz", self.driver.title)
        self.assertEqual("No issues yet", self.issues_page.get_no_issue_yet_text())                
        
    # Test case 33: Create issue without name and Submit
    def test33_create_issue_submit(self):
        self.issues_page.navigate_to_create_issue_page()
        self.issues_page.add_issue_name("")
        self.issues_page.add_issue_title("Issue Title 5")
        self.issues_page.click_submit_button()
        time.sleep(1)
        self.assertEqual("Ticket Name is required.", self.issues_page.get_ticket_name_is_required_text())

    # Test case 34: Create issue without title and Submit
    def test34_create_issue_submit(self):
        self.issues_page.navigate_to_create_issue_page()
        self.issues_page.add_issue_name("Issue Name 5")
        self.issues_page.add_issue_title("")
        self.issues_page.click_submit_button()
        time.sleep(1)
        self.assertEqual("Ticket Title is required.", self.issues_page.get_ticket_title_is_required_text())

    # Test case 35: Create issue without description and Submit
    def test35_create_issue_submit(self):
        self.issues_page.navigate_to_create_issue_page()
        self.issues_page.add_issue_name("Issue Name 5")
        self.issues_page.add_issue_title("Issue Title 5")
        self.issues_page.click_submit_button()
        time.sleep(1)
        self.assertEqual("Ticket Description is required.", self.issues_page.get_ticket_description_is_required_text())

    # Test case 36: Create issue with and Submit
    def test36_create_issue_submit(self):
        self.issues_page.navigate_to_create_issue_page()
        self.issues_page.add_issue_name("Issue Name 5")
        self.issues_page.add_issue_title("Issue Title 5")
        self.issues_page.add_issue_description("submit button is not working correctly")
        self.issues_page.click_submit_button()
        self.issues_page.select_developer("Mustafa Mahmoud")
        self.issues_page.click_assign_button()
        time.sleep(2)
        self.assertEqual("User assigned successfully", self.driver.switch_to.alert.text)
        self.driver.switch_to.alert.accept()
        self.issues_page.click_view_created_issue_details_button()
        time.sleep(1)
        self.assertEqual("Issue Details - BugWhiz", self.driver.title)
        self.assertEqual("Name : Issue Name 5", self.issue_details_page.get_issue_name())
        self.assertEqual("Title : Issue Title 5", self.issue_details_page.get_issue_title())
        self.assertEqual("submit button is not working correctly", self.issue_details_page.get_issue_description())

    '''
    
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))
