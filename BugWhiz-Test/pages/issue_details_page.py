from .base_page import BasePage
from selenium.webdriver.common.by import By
import time

class IssueDetailsPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        self.view_issues_button = "//*[@id='root']/div/div[2]/div[2]/table/tbody/tr/td[2]/button[3]"
        self.view_details_button = "//button[contains(text(),'View Details')]"
        self.issue_name = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/h6[1]"
        self.issue_title = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/h6[1]"
        self.issue_status = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[3]/div[1]/h6[1]"
        self.issue_priority = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[3]/div[2]/h6[1]"
        self.issue_category = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[3]/div[3]/h6[1]"
        self.issue_description = "//p[contains(text(),'submit button is not working correctly')]"
        self.issue_assignee = "//p[contains(text(),'Mustafa Mahmoud')]"
        self.issue_reporter = "//p[contains(text(),'KarimMahmoud')]"
        self.created_at = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[7]/span[1]"
        self.updated_at = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[7]/span[2]"

        # comments section
        self.comment_field = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/input[1]"
        self.add_comment_button = "//div[contains(text(),'ADD COMMENT')]"
        self.comment_content = "//span[contains(text(),'karim')]"
        self.delete_comment_button = "//div[contains(text(),'DELETE')]"
        self.confirm_delete_comment_button = "//div[contains(text(),'CONFIRM')]"
        self.cancel_delete_comment_button = "//div[contains(text(),'CANCEL')]"
        self.edit_comment_button = "//div[contains(text(),'EDIT')]"
        self.cancel_edit_comment_button = "//div[contains(text(),'CANCEL')]"
        self.save_edit_comment_button = "//div[contains(text(),'SAVE')]"
        self.comment_section = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div[1]"
        self.edit_comment_field = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/span[1]"

        # Update section
        self.update_button = "//body/div[@id='root']/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[8]/button[1]"
        self.update_title_field = "title"
        self.update_description_field = "/html[1]/body[1]/div[3]/div[3]/div[1]/div[2]/div[1]/div[1]/input[1]"
        self.update_status_field = "//div[@id='mui-component-select-ticketStatus']"
        self.update_status_list = "ticketStatus"
        self.update_priority_field = "//div[@id='mui-component-select-priority']"
        self.update_priority_list = "priority"
        self.update_category_field = "//div[@id='mui-component-select-category']"
        self.update_category_list = "category"
        self.update_developer_field = "//div[@id='mui-component-select-developerID']"
        self.update_developer_list = "developerID"
        self.developer_name = "//body/div[3]/div[3]/div[1]/div[6]/div[2]/p[1]"
        self.cancel_update_button = "//button[contains(text(),'Cancel')]"
        self.save_update_button = "//button[contains(text(),'OK')]"


    def click_view_issues_button(self):
        self.driver.find_element(By.XPATH, self.view_issues_button).click()

    def click_view_details_button(self):
        self.driver.find_element(By.XPATH, self.view_details_button).click()

    def navigate_to_issue_details_page(self):
        self.click_view_issues_button()
        time.sleep(1)
        self.click_view_details_button()
        time.sleep(1)

    def get_issue_name(self):
        return self.driver.find_element(By.XPATH, self.issue_name).text
    
    def get_issue_title(self):
        return self.driver.find_element(By.XPATH, self.issue_title).text
    
    def get_issue_status(self):
        return self.driver.find_element(By.XPATH, self.issue_status).text
    
    def get_issue_priority(self):
        return self.driver.find_element(By.XPATH, self.issue_priority).text
    
    def get_issue_category(self):
        return self.driver.find_element(By.XPATH, self.issue_category).text
    
    def get_issue_description(self):
        return self.driver.find_element(By.XPATH, self.issue_description).text
    
    def get_issue_assignee(self):
        return self.driver.find_element(By.XPATH, self.issue_assignee).text
    
    def get_issue_reporter(self):
        return self.driver.find_element(By.XPATH, self.issue_reporter).text
    
    def get_created_at(self):
        return self.driver.find_element(By.XPATH, self.created_at).text
    
    def get_updated_at(self):
        return self.driver.find_element(By.XPATH, self.updated_at).text
    
    def click_update_button(self):
        self.driver.find_element(By.XPATH, self.update_button).click()

    def add_comment(self, comment):
        self.driver.find_element(By.XPATH, self.comment_field).clear()
        self.driver.find_element(By.XPATH, self.comment_field).send_keys(comment)
        time.sleep(1)

    def click_add_comment_button(self):
        self.driver.find_element(By.XPATH, self.add_comment_button).click()
        time.sleep(1)

    def get_comment_content(self):
        return self.driver.find_element(By.XPATH, self.comment_content).text
    
    def click_delete_comment_button(self):
        self.driver.find_element(By.XPATH, self.delete_comment_button).click()
        time.sleep(1)

    def click_confirm_delete_comment_button(self):
        self.driver.find_element(By.XPATH, self.confirm_delete_comment_button).click()
        time.sleep(1)

    def click_cancel_delete_comment_button(self):
        self.driver.find_element(By.XPATH, self.cancel_delete_comment_button).click()
        time.sleep(1)

    def click_edit_comment_button(self):
        self.driver.find_element(By.XPATH, self.edit_comment_button).click()
        time.sleep(1)

    def click_save_edit_comment_button(self):
        self.driver.find_element(By.XPATH, self.save_edit_comment_button).click()
        time.sleep(1)

    def click_cancel_edit_comment_button(self):
        self.driver.find_element(By.XPATH, self.cancel_edit_comment_button).click()
        time.sleep(1)

    def cancel_edit_comment(self):
        self.driver.find_element(By.XPATH, self.comment_field).clear()
        time.sleep(1)

    def edit_comment(self, comment):
        self.driver.find_element(By.XPATH, self.edit_comment_field).clear()
        self.driver.find_element(By.XPATH, self.edit_comment_field).send_keys(comment)
        time.sleep(1)

    def get_comment_content(self):
        return self.driver.find_element(By.XPATH, self.comment_content).text
    
    def click_cancel_update_button(self):
        self.driver.find_element(By.XPATH, self.cancel_update_button).click()
        time.sleep(1)

    def click_save_update_button(self):
        self.driver.find_element(By.XPATH, self.save_update_button).click()
        time.sleep(1)

    def update_issue_title(self, title):
        self.driver.find_element(By.NAME, self.update_title_field).clear()
        self.driver.find_element(By.NAME, self.update_title_field).send_keys(title)
        time.sleep(1)

    def update_issue_description(self, description):
        self.driver.find_element(By.XPATH, self.update_description_field).send_keys(description)
        time.sleep(1)

    def update_issue_status(self, status):
        self.driver.find_element(By.XPATH, self.update_status_field).click()
        time.sleep(1)
        self.driver.find_element(By.NAME, self.update_status_list).find_element(By.XPATH, f"//li[contains(text(),'{status}')]").click()
        time.sleep(1)

    def get_updated_status(self):
        return self.driver.find_element(By.XPATH, self.update_status_field).text

    def update_issue_priority(self, priority):
        self.driver.find_element(By.XPATH, self.update_priority_field).click()
        time.sleep(1)
        # Select the priority from the list by index
        self.driver.find_element(By.NAME, self.update_priority_list).find_element(By.XPATH, f"//li[contains(text(),'{priority}')]").click()
        time.sleep(1)

    def get_updated_priority(self):
        return self.driver.find_element(By.XPATH, self.update_priority_field).text

    def update_issue_category(self, category):
        self.driver.find_element(By.XPATH, self.update_category_field).click()
        time.sleep(1)
        self.driver.find_element(By.NAME, self.update_category_list).find_element(By.XPATH, f"//li[contains(text(),'{category}')]").click()
        time.sleep(1)

    def get_updated_category(self):
        return self.driver.find_element(By.XPATH, self.update_category_field).text

    def update_issue_developer(self, developer):
        self.driver.find_element(By.XPATH, self.update_developer_field).click()
        time.sleep(1)
        self.driver.find_element(By.NAME, self.update_developer_list).find_element(By.XPATH, f"//li[contains(text(),'{developer}')]").click()
        time.sleep(1)

    def get_updated_developer(self):
        return self.driver.find_element(By.XPATH, self.update_developer_field).text

    def get_developer_name(self):
        return self.driver.find_element(By.XPATH, self.developer_name).text
    