import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}]);

fixture({
  'GET /api/questions': store.findAll,
  'GET /api/questions/{id}': store.findOne,
  'POST /api/questions': store.create,
  'PUT /api/questions/{id}': store.update,
  'DELETE /api/questions/{id}': store.destroy
});

export default store;
