beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {
    function inputValidData(TesterLK) {
        cy.log('Username will be filled')
        cy.get('input[data-testid="user"]').type('TesterLK')
        cy.get('#email').type('dolittle@hot.ee')
        cy.get('[data-cy="name"]').type('Johanna')
        cy.get('#lastName').type('Dolittle')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get('#password').type('OnlyIKnow111')
        cy.get('#confirm').type('OnlyIKnow111')
    }
    it('User can use only same both first and validation passwords', ()=>{

        // TEST 1
        // 1a - Add test steps for filling in only mandatory fields
        inputValidData('TesterLK')

        // 1b - Type confirmation password which is different from first password
        cy.get('[name="confirm"]').clear().type('OnlyIKnow112')

        // 1c - Assert that submit button is NOT enabled, successful message is NOT visible and error message is visible
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible')

        // 1d - Type confirmation password which is identical to first password
        cy.get('[name="confirm"]').clear().type('OnlyIKnow111')

        // 1e - Assert that submit button is enabled, successful message is visible and error message is NOT visible
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('not.be.visible')
    })
    
    it('User can submit form with all fields added', ()=>{
       
        // TEST 2
        //Fill in mandatory fiels
        inputValidData('TesterLK')

        // Check one option and check that only one option can be marked (Web language)
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')

        // check that it is possible to choose multiple checkboxes (favourite transport) 
        cy.get('input[type="checkbox"]').eq(2).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('be.checked')

        // Check that only one can be selected from drop-down menu (cars)
        cy.get('#cars').select(1)
        cy.get('#cars').select(2)
        cy.get('#cars').should('not.have.value','1')

        // Check that only one can be selected from drop-down menu (favorite animal)
        cy.get('#animal').select(3)
        cy.get('#animal').select(5)
        cy.get('#animal').should('not.have.value','3')

        // Submit button enambled and success message visible
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
    })

    it('User can submit form with valid data and only mandatory fields added', ()=>{

        // TEST 3
        // Fill in ONLY mandatory fiels
        inputValidData('TesterLK')

        // Assert that submit button is enabled and that after submitting the form system shows successful message
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
    })

    it('Mandatory field (Username, last name) is absent', ()=>{

        // TEST 4 
        // Fill in ONLY mandatory fiels
        inputValidData('TesterLK')

        // Delete username (mandatory field)
        cy.get('[data-testid="user"]').clear()

        // Verify that the submit button is not enabled when username (mandatory field) is not present 
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible')

        // Restore username 
        cy.get('[data-testid="user"]').clear().type('TesterLK')

        // Delete last name (mandatory field)

        cy.get('#lastName').clear()

        // Verify that the submit button is not enabled when username (mandatory field) is not present 
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible')
    })
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {

    // 1st picture (EXAMPLE)
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height, to less than 178 and greater than 100
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })

    // TEST 2 - 2nd picture (Cypress logo)
    it('My test for second picture', () => {
        cy.log('Will check logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img').eq(1).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 50)   
    });  

    // Navigaton EXAMPLE
    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    // TEST 3 - Test for checking the second link (registration link 3)
    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_3.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    // Verification of radio button list EXAMPLE
    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    // TEST 4 - Verification of checkboxes
    it('Check that checkbox list is correct', () => {
        // 4a - Array of found elements with given selector has 3 elements in total
        cy.get('input[type="checkbox"]').should('have.length', 3)

        // 4b - Verify default state of radio buttons (unchecked)
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text','I have a bike').and('not.be.checked')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','I have a car').and('not.be.checked')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text','I have a boat').and('not.be.checked')

        // 4c-4d - Check that it is possible to choose multiple options
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
    })

    // Dropdown EXAMPLE
    it('Car dropdown is correct', () => {
        // Here is an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area, and full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        //Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    // TEST 5 - Verification of dropdown (favorite animals)
    it('Animal dropdown is correct', () => {
        // 5a - Array of found elements with given selector has 6 elements in total
        cy.get('#animal').children().should('have.length',6)

        // 5b - Verify labels of the options
        cy.get('#animal').find('option').eq(0).should('have.text','Dog')
        cy.get('#animal').find('option').eq(1).should('have.text','Cat')
        cy.get('#animal').find('option').eq(2).should('have.text','Snake')
        cy.get('#animal').find('option').eq(3).should('have.text','Hippo')
        cy.get('#animal').find('option').eq(4).should('have.text','Cow')
        cy.get('#animal').find('option').eq(5).should('have.text','Horse')

        // Ceck that only one can be selected
        cy.get('#animal').select(0)
        cy.get('#animal').select(1).should('not.have.value','0')
        cy.get('#animal').select(2).should('not.have.value','1')
        cy.get('#animal').select(3).should('not.have.value','2')
        cy.get('#animal').select(4).should('not.have.value','3')
        cy.get('#animal').select(5).should('not.have.value','4')
    })

})