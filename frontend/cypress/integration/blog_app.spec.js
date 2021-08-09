describe('Blog app', function () {
  let user
  let blog

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    user = {
      username: 'testuser',
      name: 'Test User',
      password: 'secret'
    }
    cy.addUser(user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login({ username: 'testuser', password: 'secret' })
      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('#notification')
        .should('contain', 'invalid username or password')

      cy.get('html').should('not.contain', 'logged in as')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: 'secret' })
      blog = {
        title: 'Test Title',
        author: 'John Smith',
        url: 'http://www.testurl.com',
        likes: 0
      }
    })

    it('A blog can be created', function () {
      cy.contains('create new').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#create-blog-button').click()

      cy.contains(`a new blog ${blog.title} by ${blog.author} added`)
      cy.contains(`${blog.title}`)
      cy.contains(`${blog.author}`)
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.addBlog(blog)
      })

      it('liking a blog correctly updates the like count', function () {
        cy.contains(`${blog.title}`).click()

        cy.contains('like').parent().as('likes')
        cy.get('@likes').contains('0')
        cy.get('@likes').find('button').click()
        cy.get('@likes').contains('1')
      })

      it('the user who created the blog can delete it', function () {
        cy.contains(`${blog.title}`).click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', `${blog.title} ${blog.author}`)
      })

      it('users cannot delete blogs created by others', function () {
        cy.addUser({ username: 'otheruser', name: 'Other User', password: 'secret' })
        cy.logout()
        cy.login({ username: 'otheruser', password: 'secret' })

        cy.contains(`${blog.title}`).click()
        cy.get('html').should('not.contain', 'remove')
      })

      it('the user can comment on the blog', function () {
        const comment = 'superb article!'
        cy.contains(`${blog.title}`).click()
        cy.get('#comment-input').type(comment)
        cy.get('#add-comment-button').click()
        cy.contains(comment)
      })
    })

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        for (let i = 0; i < 5; i++) {
          cy.task('newBlog').then(blog => cy.addBlog(blog))
        }
      })

      it('blogs are sorted in order from most to least likes', function () {
        let prevValue = null
        cy.get('.blogItem')
          .each(($blog, index) => {
            cy.get('.blogLink').eq(index).click()
            cy.get('.blogLikes').then($div => {
              const currValue = Number($div[0].childNodes[0].nodeValue)
              prevValue && expect(currValue).to.be.at.most(prevValue)
              prevValue = currValue
            })
            cy.go('back')
          })
      })
    })
  })
})