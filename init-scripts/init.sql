WHENEVER SQLERROR EXIT SQL.SQLCODE;
@/container-entrypoint-initdb.d/01_create_tables.sql
@/container-entrypoint-initdb.d/02_insert_sample_data.sql
COMMIT;
EXECUTE DBMS_SESSION.SET_ROLE('DBA');
ALTER SYSTEM CHECKPOINT;
SELECT COUNT(*) FROM v$transaction;
SELECT 'Database initialization completed successfully.' FROM DUAL;
exit; 