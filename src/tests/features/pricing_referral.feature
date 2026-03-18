Feature: Origin Energy Pricing and Referral Flow

  As a potential customer
  I want to view energy plans for my address
  So that I can be referred to official comparison sites if needed

  Background:
    Given user navigates to the Origin Energy pricing page

  Scenario: Verify the first gas plan link displayed is clicked and validate whether the external referral hand-off is successful
    When user enters the address and selects the address from the dropdown
    And user validates whether the plan list is displayed with both Electricity and Natural Gas checked
    And user unchecks the Electricity checkbox
    And user should see that only Gas plans are still displayed
    Then user clicks on the first gas plan link displayed on the plan detail table
    And user validates whether the clicked gas plan link contains the expected domain
    And a new tab should be opened for EnergyMadeEasy
    And then user validates the url for referral
    And then user validates the origin logo in the new page


  Scenario: Verify NetworkMocking using the Plans Search API
    When user enters the address and selects the address from the dropdown
    And the server returns a error for the plan list request
    Then user should not be able to see any plan List



