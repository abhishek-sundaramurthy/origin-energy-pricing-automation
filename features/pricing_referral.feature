Feature: Origin Energy Pricing and Referral Flow

  As a potential customer
  I want to view energy plans for my address
  So that I can be referred to official comparison sites if needed

  Background:
    Given I navigate to the Origin Energy pricing page

  Scenario: Verify gas plan display and external referral hand-off
    When I search for the address "12 Smith Street, Surry Hills, NSW 2010"
    And I validate whether plan list is displayed
    And I uncheck the "Electricity" filter
    And I should see that Gas plans are still displayed
    Then I click on a plan link to view details
    And a new tab should open for "EnergyMadeEasy"
    And the page should display Origin Energy branding
    And the URL should contain "originenergy" as a referral parameter