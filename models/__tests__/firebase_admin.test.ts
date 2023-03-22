import FirebaseAdmin from '../firebase_admin';

describe('FirebaseAdmin', () => {
  it('should generate its instance', () => {
    const instance = FirebaseAdmin.getInstance();
    expect(instance).toBeInstanceOf(FirebaseAdmin);
  });

  it('should generate its instance only once.', () => {
    const instance = FirebaseAdmin.getInstance();
    const instance2 = FirebaseAdmin.getInstance();
    expect(instance).toEqual(instance2);
  });
});
