resource "google_firestore_database" "database" {
  project     = "project-id"
  name        = DATABASE_ID
  location_id = LOCATION
  type        = DATABASE_TYPE

  // Optional
  delete_protection_state = DELETE_PROTECTION_STATE
}

# Substitua:

# DATABASE_ID: um ID válido do banco de dados.
# LOCATION: o nome de uma multirregião ou região do Cloud Firestore.
# DATABASE_TYPE: FIRESTORE_NATIVE para o modo nativo ou DATASTORE_MODE para o modo Datastore.
# DELETE_PROTECTION_ENABLEMENT: DELETE_PROTECTION_ENABLED ou DELETE_PROTECTION_DISABLED.
# delete_protection_state é um argumento opcional para ativar a proteção contra exclusão. Não é possível excluir um banco de dados com a proteção contra exclusão ativada até que essa configuração seja desativada. Esta configuração fica desativada por padrão.