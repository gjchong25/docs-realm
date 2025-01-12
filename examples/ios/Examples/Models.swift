import RealmSwift

// :snippet-start: person-model
class Person: Object {
    // Required string property
    @Persisted var name: String = ""

    // Optional string property
    @Persisted var address: String?

    // Optional integral type property
    @Persisted var age: Int?
}
// :snippet-end:
