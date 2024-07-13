import unittest
import HtmlTestRunner

# Import test cases
from tests.test_login import TestLogin
from tests.test_projects import TestProjects
from tests.test_issues import TestIssues
from tests.test_signup import TestSignup
from tests.test_profile import TestProfile
from tests.test_issue_details import TestIssueDetails

# Create a TestSuite and add test cases in the specific order
suite = unittest.TestSuite()
suite.addTest(unittest.makeSuite(TestSignup))
#suite.addTest(unittest.makeSuite(TestLogin))
#suite.addTest(unittest.makeSuite(TestProfile))
#suite.addTest(unittest.makeSuite(TestProjects))
#suite.addTest(unittest.makeSuite(TestIssues))
#suite.addTest(unittest.makeSuite(TestIssueDetails))


# Run the tests
runner = HtmlTestRunner.HTMLTestRunner(output='reports')
runner.run(suite)
