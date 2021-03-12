<script>
export default {
  name: 'MixinRules',

  data: () => ({
    // Rules
    rules: {
      required: value => !!value || 'Requis',
      min: value => (value !== null && value !== undefined && value.length >= 8) || 'Min 8 caractères',
      maxSmall: value => (value !== null && value !== undefined && value.length <= 50) || 'Max 50 caractères',
      maxBig: value => (value !== null && value !== undefined && value.length <= 500) || 'Max 500 caractères',
      ascii: value => (value !== null && value !== undefined && value.split('').every(v => v.charCodeAt(0) >= 32 && v.charCodeAt(0) <= 255)) || 'Contient un caractère invalide !',
      nameMatch (name) { return value => value === name || 'Les noms ne correspondent pas !' },
      passwordMatch (name) { return value => value === name || 'Les mots de passe ne correspondent pas !' },
      passwordFirstConnexion: value => (value !== null && value !== undefined && !value.startsWith('hyla')) || 'Le mot de passe ne doit pas commencer par "hyla" !',
      noEmptyAdmin: value => (value !== null && value !== undefined && value !== -1) || 'Aucun Admin n\'est sélectionné !',
      identifiant: value => (!value || /^[0-9]\d*$/.test(value)) || 'l\'identifiant doit être un nombre !',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail invalide'
      }
    },

    // Messages to display if an error occurs
    errorMessages: {
      failedLogin: 'Erreur dans le login',
      failedProviderNew: 'Il y a eu une erreur dans la création de Provider',
      failedCreate_ClientAccount: 'Le compte client n\'a pas pu être créé',
      failedAddUser_ClientAccount: 'L\'utilisateur n\'a pas pu être ajouté',
      failedModifyTeam_ClientAccount: 'Les modifications n\'ont pas pu être prises en compte'
    },

    successMessages: {
      successAddUser_ClientAccount: 'Les utilisateurs ont bien été ajoutés à la liste'
    }
  })
}
</script>

