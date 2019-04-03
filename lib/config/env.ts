export = {
    PORT: process.env.PORT || 3001,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://testuser:testpass@localhost:5432/test',
    QM_USER: process.env.QM_USER || 'admin',
    QM_PASSWORD: process.env.QM_PASSWORD || 'password',
    QM_EMAIL: process.env.QM_EMAIL || 'abc@abc.com',
    QM_PHONE: process.env.QM_PHONE || '1234567',
}