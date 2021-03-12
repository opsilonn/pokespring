<script>
export default {
  name: 'MixinRoles',

  data: () => ({
    roles: [
      { bIsGM: true, name: 'Owner' },
      { bIsGM: true, name: 'Game Master' },
      { bIsGM: false, name: 'Player' }
    ]
  }),

  methods: {
    /** Returns the role given some parameters */
    getRole (isCreator, isGM) {
      // We get the index
      const index = isCreator ? 0 : isGM ? 1 : 2

      // Return the corresponding role
      return this.roles[index]
    },

    /** Returns all the role's names */
    getRolesNames () {
      return this.roles.map(r => r.name)
    },

    /**
     * Returns all the role's names can add
     */
    getRolesNamesCanAdd (isCreator, isGM) {
      const role = this.getRole(isCreator, isGM)
      return this.roles.slice(this.roles.findIndex(r => r === role) + 1, this.roles.length).map(r => r.name)
    },

    /** returns a role given its name */
    getRoleByName (name) {
      return this.roles.find(r => r.name === name)
    }
  }
}
</script>
