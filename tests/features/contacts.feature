# Created by Joe at 3/16/2019

Feature: Contact Management
  A local organizer needs to manage local contacts

  Background: prerequisite
    Given I have registered with Bluestreets
    And I have defined my catchment area

  Scenario: Import all from Bluestreets
    Given I have no contact records.
    When I request contacts with no since date
    Then all contacts in my area should be saved to local DB

  Scenario: Import updated contacts from Bluestreets
    Given I have contact records
    When I request contact with a since date
    Then all contacts updated since date should be save to local DB

  Scenario: Import from spreadsheet
    Given a spreadsheet with contact data
    When I do 'Import Spreadsheet'
    Then all spreadsheet records should be added to my local DB

  Scenario: Save to local DB
    Given I have loaded from local DB
    When I Save
    Then all records should be upserted to my local DB

  Scenario: Load from local DB
    Given I want to manage my contacts
    When I Load Contacts
    Then all records in local DB should be loaded into app

  Scenario: Add new contact

  Scenario: Update contact

  Scenario: Remove contact

  Scenario: Remove duplicates

  Scenario: Assign precinct

  Scenario: Export to Bluestreets