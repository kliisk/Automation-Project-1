beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */
describe('Bonus task: Visual tests for registration form 3', () => {
    function inputValidData(TesterLK) {
        cy.get('#name').clear().type('Tester')
        cy.get('input[name="email"]').type('testemail@ch.ee')
        cy.get('#country').select(3)
        cy.get('#city').select(2)
        cy.get('input[type="date"]').first().type('1991-03-16')
        cy.get('input[name="freq"]').eq(1).check().should('be.checked')
        cy.get('input[ng-model="checkbox"]').first().check().should('be.checked')
    }

    // TEST 1 - Verification of radio buttons (newsletter frequency)
    it('Check that radio list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')
        // check that it is possible to choose multiple
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    // TEST 2 - Dropdown menus are working correctly and dependencies between 2 dropdowns (Country -> city)
    it('Check that country drop-down menu works correctly', () => {
        // Array of found elements with given selector has 4 elements in total (first empty)
        cy.get('#country').children().should('have.length', 4)
        
        //  Verify labels of the options
        cy.get('#country').find('option').eq(1).should('have.text','Spain').should('not.be.checked')
        cy.get('#country').find('option').eq(2).should('have.text','Estonia').should('not.be.checked')
        cy.get('#country').find('option').eq(3).should('have.text','Austria').should('not.be.checked')

        // check that only one can be selected
        cy.get('#country').select(1)
        cy.get('#country').select(2).should('not.have.value','1')
        cy.get('#country').select(3).should('not.have.value','2')
    })
    
    it('Check that city drop-down menu works correctly (depending on the country)', () => {
        
        // Choose option 1 (Spain)
        cy.get('#country').select(1)

        // Array of found elements with given selector has 5 elements in total (first empty)
        cy.get('#city').children().should('have.length', 5)

        //  Verify labels of the city options
        cy.get('#city').find('option').eq(1).should('have.text','Malaga').should('not.be.checked')
        cy.get('#city').find('option').eq(2).should('have.text','Madrid').should('not.be.checked')
        cy.get('#city').find('option').eq(3).should('have.text','Valencia').should('not.be.checked')
        cy.get('#city').find('option').eq(4).should('have.text','Corralejo').should('not.be.checked')

        // check that only one can be selected
        cy.get('#city').select(1)
        cy.get('#city').select(2).should('not.have.value','1')
        cy.get('#city').select(3).should('not.have.value','2')
        cy.get('#city').select(4).should('not.have.value','3')

        // Choose option 2 (Estonia)
        cy.get('#country').select(2)

        // Array of found elements with given selector has 4 elements in total (first empty)
        cy.get('#city').children().should('have.length', 4)

        //  Verify labels of the city options
        cy.get('#city').find('option').eq(1).should('have.text','Tallinn').should('not.be.checked')
        cy.get('#city').find('option').eq(2).should('have.text','Haapsalu').should('not.be.checked')
        cy.get('#city').find('option').eq(3).should('have.text','Tartu').should('not.be.checked')

        // check that only one can be selected
        cy.get('#city').select(1)
        cy.get('#city').select(2).should('not.have.value','1')
        cy.get('#city').select(3).should('not.have.value','2')

        // Choose option 3 (Austria)
        cy.get('#country').select(3)

        // Array of found elements with given selector has 5 elements in total (first empty)
        cy.get('#city').children().should('have.length', 4)

        //  Verify labels of the city options
        cy.get('#city').find('option').eq(1).should('have.text','Vienna').should('not.be.checked')
        cy.get('#city').find('option').eq(2).should('have.text','Salzburg').should('not.be.checked')
        cy.get('#city').find('option').eq(3).should('have.text','Innsbruck').should('not.be.checked')

        // check that only one can be selected
        cy.get('#city').select(1)
        cy.get('#city').select(2).should('not.have.value','1')
        cy.get('#city').select(3).should('not.have.value','2')
    })

    // TEST 3 - Checkboxes, privacy and cookie policy links
    it('Check navigation to Privacy policy', () => {
        // Verifing the names of the policies (privacy and cookie)
        cy.get(':nth-child(15)').should('contain','Accept our privacy policy')  
        cy.get('a').should('contain', 'Accept our cookie policy').should('be.visible')

        // Checking both policies (privacy and cookie)
        cy.get('[ng-model="checkbox"]').check().should('be.checked')
        cy.get(':nth-child(15) > :nth-child(2)').check().should('be.checked')
        
        // Verifing if it is possible to navigate to cookie policy page and back
        // Cookie policy
        cy.get('a').should('be.visible').and('have.attr', 'href', 'cookiePolicy.html').click()
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back')
        cy.log('Back again in registration form 3')
    })

    // TEST 4 - email valid and INVALID format
    it('Email input should support correct pattern', () => {
        // adding mandatory fields
        inputValidData('TesterLK')
    
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('be.enabled')
    
        // Deleting correct email and leaving space EMPTY
        cy.get('input[name="email"]').clear()
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('not.be.enabled')
        cy.get('[ng-show="myForm.email.$error.required"]').should('be.visible')
    
        // Submitting INVALID email
        cy.get('input[name="email"]').type('tester')
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('not.be.enabled')
        cy.get('[ng-show="myForm.email.$error.email"]').should('be.visible')
    })
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */
describe('Bonus task: Functional tests for registration form 3', () => {
    function inputValidData(TesterLK) {
        cy.get('#name').clear().type('Tester')
        cy.get('input[name="email"]').type('testemail@ch.ee')
        cy.get('#country').select(3)
        cy.get('#city').select(2)
        cy.get('input[name="freq"]').eq(1).check().should('be.checked')
        cy.get('input[ng-model="checkbox"]').first().check().should('be.checked')
    }
    // TEST 5 - all fields are filled in + validation
    it('All fields are filled in and validated', () => {
        inputValidData('TesterLK')
        cy.get('input[type="date"]').first().type('1991-03-16')
        cy.get('#birthday').type('1991-03-16')
        cy.get(':nth-child(15) > :nth-child(2)').check().should('be.checked')
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('be.enabled').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back again in registration form 3')
    })

    // TEST 6 - only mandatory fields are filled in + validations
    it('Mandatory fields are filled in and validated', () => {
        inputValidData('TesterLK')
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('be.enabled').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back again in registration form 3')

    })

    // TEST 7 - mandatory fields are absent + validations (try using function)
    // Name is deleted (mandatory field)
    it('Name is deleted (mandatory field) and validation', () => {
        inputValidData('TesterLK')
        cy.get('#name').clear()

        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('not.be.enabled')
    }) // Possible to Submit without Name!! No error dispayed!

     // City is deleted (mandatory field)
     it('City is deleted (mandatory field) and validation', () => {
        inputValidData('TesterLK')
        cy.get('#city').select(0)

        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('not.be.enabled')
    }) 
        
    // TEST 8 - If city is already chosen and country is updated, then city choice should be removed
    it('If country is updated, then city choice is removed', () => {
        inputValidData('TesterLK')
        cy.get('#country').select(1)
        cy.get('#city').should('not.have.value')
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('not.be.enabled')
    }) 

    // TEST 9 - Add file and finish the submission
    it('File can be uploaded', () => {
        inputValidData('TesterLK')
        cy.get('#myFile').should('be.visible').click()
        cy.get('input[type=file]').selectFile('cypress/brainstorm.jpg')
        cy.get('h2').contains('Birthday').click()
        cy.get('[onclick="postYourAdd()"]').should('be.enabled').click()
    }) 
})