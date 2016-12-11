import fixture from 'can-fixture';

const store = fixture.store([{
  id: 0,
  description: 'First item'
}, {
  id: 1,
  description: 'Second item'
}]);

fixture({
  'GET /api/answers': store.findAll,
  'GET /api/answers/{id}': store.findOne,
  'POST /api/answers': store.create,
  'PUT /api/answers/{id}': store.update,
  'DELETE /api/answers/{id}': store.destroy
});

export default store;
