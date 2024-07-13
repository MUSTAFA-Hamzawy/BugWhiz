import unittest
from pages.login_page import LoginPage
from pages.issue_details_page import IssueDetailsPage
from utils.driver_setup import get_driver
from utils.config import BASE_URL
import HtmlTestRunner
import time

class TestIssueDetails(unittest.TestCase):
    def setUp(self):
        self.driver = get_driver()
        self.driver.maximize_window()
        self.driver.get(BASE_URL + "/login")
        self.login_page = LoginPage(self.driver)
        self.login_page.login()
        self.assertEqual(self.driver.current_url, BASE_URL + "/projects")
        self.issue_details_page = IssueDetailsPage(self.driver)
        self.issue_details_page.navigate_to_issue_details_page()
        self.assertEqual(self.driver.current_url, BASE_URL + "/issueDetails")



    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output='reports'))




    '''
    def test0_navigate_to_issues_page(self):
        self.assertEqual("Issue Details - BugWhiz", self.driver.title)
                
    # Test case 1 : Validate the issue name
    def test1_issue_name(self):
        time.sleep(1)
        issue_name = self.issue_details_page.get_issue_name()
        self.assertEqual("Name : issue 1", issue_name)

    # Test case 2 : Validate the issue title
    def test2_issue_title(self):
        time.sleep(1)
        issue_title = self.issue_details_page.get_issue_title()
        self.assertEqual("Title : Submit button problem", issue_title)

    # Test case 3 : Validate the issue status
    def test3_issue_status(self):
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nTODO", issue_status)

    # Test case 4 : Validate the issue priority
    def test4_issue_priority(self):
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP1", issue_priority)

    # Test case 5 : Validate the issue category
    def test5_issue_category(self):
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nFrontend", issue_category)

    # Test case 6 : Validate the issue description
    def test6_issue_description(self):
        time.sleep(1)
        issue_description = self.issue_details_page.get_issue_description()
        self.assertEqual("submit button is not working correctly", issue_description)

    # Test case 7 : Validate the issue assignee
    def test7_issue_assignee(self):
        time.sleep(1)
        issue_assignee = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Mustafa Mahmoud", issue_assignee)

    # Test case 8 : Validate the issue reporter
    def test8_issue_reporter(self):
        time.sleep(1)
        issue_reporter = self.issue_details_page.get_issue_reporter()
        self.assertEqual("KarimMahmoud", issue_reporter)

    # Test case 9 : Validate the issue created at
    def test9_created_at(self):
        time.sleep(1)
        created_at = self.issue_details_page.get_created_at()
        self.assertEqual("Created at 12/07/2024, 02:52:41", created_at)

    # Test case 10 : Validate the issue updated at
    def test10_updated_at(self):
        time.sleep(1)
        updated_at = self.issue_details_page.get_updated_at()
        self.assertEqual("Updated at 12/07/2024, 07:41:04", updated_at)

    # Test case 11: Add comment to the issue
    def test11_add_comment(self):
        time.sleep(1)
        self.issue_details_page.add_comment("karim")
        self.issue_details_page.click_add_comment_button()
        time.sleep(1)
        comment_content = self.issue_details_page.get_comment_content()
        self.assertEqual("karim", comment_content)

    # Test case 12: Edit comment with cancel ( use click_edit_comment_button)
    def test12_edit_comment_with_cancel(self):
        time.sleep(1)
        self.issue_details_page.click_edit_comment_button()
        time.sleep(1)
        self.issue_details_page.edit_comment("karim22")
        self.issue_details_page.click_cancel_edit_comment_button()
        time.sleep(1)
        comment_content = self.issue_details_page.get_comment_content()
        self.assertEqual("karim", comment_content)

    # Test case 13: Edit comment with save ( use click_edit_comment_button)
    def test13_edit_comment_with_save(self):
        time.sleep(1)
        self.issue_details_page.click_edit_comment_button()
        time.sleep(1)
        self.issue_details_page.edit_comment("karim22")
        self.issue_details_page.click_save_edit_comment_button()
        time.sleep(1)
        comment_content = self.issue_details_page.get_comment_content()
        self.assertEqual("karim22", comment_content)

    # Test case 14: Delete comment with cancel ( use click_delete_comment_button)
    def test14_delete_comment_with_cancel(self):
        time.sleep(1)
        self.issue_details_page.click_delete_comment_button()
        time.sleep(1)
        self.issue_details_page.click_cancel_delete_comment_button()
        time.sleep(1)
        comment_content = self.issue_details_page.get_comment_content()
        self.assertEqual("karim22", comment_content)

    # Test case 15: Delete comment with confirm ( use click_delete_comment_button)
    def test15_delete_comment_with_confirm(self):
        time.sleep(1)
        self.issue_details_page.click_delete_comment_button()
        time.sleep(1)
        self.issue_details_page.click_confirm_delete_comment_button()
        time.sleep(1)
        self.issue_details_page.add_comment("karim55")
        self.issue_details_page.click_add_comment_button()
        time.sleep(1)
        comment_content = self.issue_details_page.get_comment_content()
        self.assertEqual("karim55", comment_content)

    # Test case 16: Update issue title with cancel
    def test16_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_title("22")
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_title = self.issue_details_page.get_issue_title()
        self.assertEqual("Title : Submit button problem", issue_title)

    # Test case 17: Update issue title with save
    def test17_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_title("22")
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_title = self.issue_details_page.get_issue_title()
        self.assertEqual("Title : Submit button problem22", issue_title)

# Test case 18: Update issue staus to In Progress with cancel
    def test18_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("In Progress")
        self.assertEqual("In Progress", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nTODO", issue_status)

    # Test case 19: Update issue status to TODO with cancel
    def test19_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("TODO")
        self.assertEqual("TODO", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nTODO", issue_status)

    # Test case 20: Update issue status to Done with cancel
    def test20_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("DONE")
        self.assertEqual("DONE", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nTODO", issue_status)

        
    # Test case 21: Update issue status to In Progress with save
    def test21_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("In Progress")
        self.assertEqual("In Progress", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nIn Progress", issue_status)

    # Test case 22: Update issue status to TODO with save
    def test22_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("TODO")
        self.assertEqual("TODO", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nTODO", issue_status)

    # Test case 23: Update issue status to Done with save
    def test23_update_issue_status(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_status("DONE")
        self.assertEqual("DONE", self.issue_details_page.get_updated_status())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_status = self.issue_details_page.get_issue_status()
        self.assertEqual("Status :\nDone", issue_status)


    # Test case 24 : Update issue priority to P1 with cancel
    def test24_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P1")
        self.assertEqual("P1", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP2", issue_priority)

    # Test case 25 : Update issue priority to P1 with save
    def test25_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P1")
        self.assertEqual("P1", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP1", issue_priority)

    # Test case 26 : Update issue priority to P2 with cancel
    def test26_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P2")
        self.assertEqual("P2", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP1", issue_priority)

    # Test case 27 : Update issue priority to P2 with save
    def test27_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P2")
        self.assertEqual("P2", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP2", issue_priority)

    # Test case 28 : Update issue priority to P3 with cancel
    def test28_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P3")
        self.assertEqual("P3", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP2", issue_priority)

    # Test case 29 : Update issue priority to P3 with save
    def test29_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P3")
        self.assertEqual("P3", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP3", issue_priority)

    # Test case 30 : Update issue priority to P4 with cancel
    def test30_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P4")
        self.assertEqual("P4", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP3", issue_priority)

    # Test case 31 : Update issue priority to P4 with save
    def test31_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P4")
        self.assertEqual("P4", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP4", issue_priority)

    # Test case 32 : Update issue priority to P5 with cancel
    def test32_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P5")
        self.assertEqual("P5", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP4", issue_priority)

    # Test case 33 : Update issue priority to P5 with save
    def test33_update_issue_priority(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_priority("P5")
        self.assertEqual("P5", self.issue_details_page.get_updated_priority())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_priority = self.issue_details_page.get_issue_priority()
        self.assertEqual("Priority :\nP5", issue_priority)


    # Test case 34: Update issue category to Frontend with cancel
    def test34_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Frontend")
        self.assertEqual("Frontend", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nFrontend", issue_category)

    # Test case 35: Update issue category to Frontend with save
    def test35_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Frontend")
        self.assertEqual("Frontend", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nFrontend", issue_category)

    # Test case 36: Update issue category to Backend with cancel
    def test36_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Backend")
        self.assertEqual("Backend", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nFrontend", issue_category)

    # Test case 37: Update issue category to Backend with save
    def test37_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Backend")
        self.assertEqual("Backend", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nBackend", issue_category)

    # Test case 38: Update issue category to Security with cancel
    def test38_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Security")
        self.assertEqual("Security", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nBackend", issue_category)

    # Test case 39: Update issue category to Security with save
    def test39_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Security")
        self.assertEqual("Security", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nSecurity", issue_category)

    # Test case 40: Update issue category to Documentation with cancel
    def test40_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Documentation")
        self.assertEqual("Documentation", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nSecurity", issue_category)

    # Test case 41: Update issue category to Documentation with save
    def test41_update_issue_category(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_category("Documentation")
        self.assertEqual("Documentation", self.issue_details_page.get_updated_category())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_category = self.issue_details_page.get_issue_category()
        self.assertEqual("Category :\nDocumentation", issue_category)
    
    # Test case 42: Update issue Developer to Mustafa Mahmoud Hamzawy with cancel
    def test42_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Mustafa Mahmoud Hamzawy")
        self.assertEqual("Mustafa Mahmoud Hamzawy", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Mustafa Mahmoud", issue_developer)    

    # Test case 43: Update issue Developer to Mustafa Mahmoud Hamzawy with save
    def test43_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Mustafa Mahmoud Hamzawy")
        self.assertEqual("Mustafa Mahmoud Hamzawy", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Mustafa Mahmoud Hamzawy", issue_developer)
    
    # Test case 44: Update issue Developer to Karim Mohamed with cancel
    def test44_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Karim Mohamed")
        self.assertEqual("Karim Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Mustafa Mahmoud Hamzawy", issue_developer)

    # Test case 45: Update issue Developer to Karim Mohamed with save
    def test45_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Karim Mohamed")
        self.assertEqual("Karim Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Karim Mohamed", issue_developer)

    # Test case 46: Update issue Developer to Ahmed Mohamed with cancel
    def test46_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Ahmed Mohamed")
        self.assertEqual("Ahmed Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Karim Mohamed", issue_developer)

    # Test case 47: Update issue Developer to Ahmed Mohamed with save
    def test47_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Ahmed Mohamed")
        self.assertEqual("Ahmed Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Ahmed Mohamed", issue_developer)

    # Test case 48: Update issue Developer to Hazem Mohamed with cancel
    def test48_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Hazem Mohamed")
        self.assertEqual("Hazem Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_cancel_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Ahmed Mohamed", issue_developer)

    # Test case 49: Update issue Developer to Hazem Mohamed with save
    def test49_update_issue_developer(self):
        time.sleep(1)
        self.issue_details_page.click_update_button()
        time.sleep(2)
        self.issue_details_page.update_issue_developer("Hazem Mohamed")
        self.assertEqual("Hazem Mohamed", self.issue_details_page.get_updated_developer())
        self.issue_details_page.click_save_update_button()
        time.sleep(1)
        issue_developer = self.issue_details_page.get_issue_assignee()
        self.assertEqual("Hazem Mohamed", issue_developer)
        
'''