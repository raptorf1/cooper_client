describe('User attempts to view his/her performance data', () => {

  before(function() {
    cy.visit('http://localhost:3001');
    cy.server()
    cy.route({
      method: 'GET',
      url: 'https://cooper-felix-george.herokuapp.com/api/v1/performance_data',
      response: 'fixture:performance_data_index.json'
    })
    cy.route({
      method: 'POST',
      url: 'https://cooper-felix-george.herokuapp.com/api/v1/auth/sign_in',
      response: 'fixture:login_valid.json',
      headers: {
        "uid": "user@mail.com"
      }
    })
    cy.get('#login').click();
    cy.get('#login-form').within(() => {
      cy.get('#email').type('user@mail.com')
      cy.get('#password').type('password')
      cy.get('#submit').click()
    })
  });

  it('successfully', async () => {
    cy.get('button[id="show-index"]').click()
    cy.contains('Below Average')
    cy.contains('Average')
    cy.contains('Above Average')
  })
})
