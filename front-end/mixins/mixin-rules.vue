<script>
export default {
  name: 'MixinRules',

  data: () => ({
    // Rules
    rules: {
      required: value => !!value || 'Required',
      min: value => (value !== null && value !== undefined && value.length >= 8) || '8 characters min',
      maxSmall: value => (value !== null && value !== undefined && value.length <= 50) || '50 characters max',
      maxBig: value => (value !== null && value !== undefined && value.length <= 500) || '500 characters max',
      nameMatch (name) { return value => value === name || 'The names don\'t match !' },
      passwordMatch (name) { return value => value === name || 'The passwords don\'t match !' },
      identifiant: value => (!value || /^[0-9]\d*$/.test(value)) || 'The identifier must be a number !',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'invalid E-mail !'
      }
    },

    // Messages to display if an error occurs
    mxRules_errorMessages: {
      failedLogin: 'Invalid credentials ! please try again',
      failedSignup: 'Invalid username or email, an account is already registered with one of them'
    },

    mxRules_successMessages: {
      successAddUser_ClientAccount: 'Les utilisateurs ont bien été ajoutés à la liste'
    }
  })
}
</script>

