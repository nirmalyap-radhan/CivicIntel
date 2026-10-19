import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.database import Base, get_db
from app.core.security import create_access_token
from app.main import app
from app.models.user import User
from app.services.seed_service import seed_database
from app.services.rag_service import seed_curated_documents

# Mark testing mode so lifespan skips remote database roundtrips
settings.TESTING = True

# Use dedicated test SQLite database
TEST_DATABASE_URL = "sqlite:///./test_civicintel.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)



@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_database(db)
    seed_curated_documents(db, force=True)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_headers(db):
    admin = db.query(User).filter(User.role == "system_admin").first()
    token = create_access_token(subject=admin.id, role=admin.role)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def gov_headers(db):
    gov = db.query(User).filter(User.role == "government_official").first()
    token = create_access_token(subject=gov.id, role=gov.role)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def citizen_headers(db):
    citizen = db.query(User).filter(User.role == "citizen").first()
    token = create_access_token(subject=citizen.id, role=citizen.role)
    return {"Authorization": f"Bearer {token}"}
