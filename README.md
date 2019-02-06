###Getting started
#####Database (MySQL)
1. **Enter to mysql**
<br>`mysql -u root -p`
2. `CREATE DATABASE db_name;`
3. **Create seperate users to make migrations and data manipulation**
<br>`CREATE USER 'db_migrations_user'@'localhost' IDENTIFIED BY 'pass';`
<br>`CREATE USER 'db_crud_user'@'localhost' IDENTIFIED BY 'pass2';`
4. **Grant privileges for migrations user to only create, alter, drop tables, NOT db.
<br>Absolute minimum of permissions for migration is:**
<br> Alter table permission is for adding CONSTRAINTS.
<br>`GRANT DROP, CREATE, ALTER ON TABLE db_name.* TO 'db_migrations_user'@'localhost';`
<br>`GRANT INDEX  ON TABLE cityview_db.* TO 'cityview_dbstruct_user'@'localhost';`
<br> References permission is for adding FK.
<br>`GRANT  REFERENCES  ON cityview_db.* TO 'cityview_dbstruct_user'@'localhost';`
5. `GRANT DELETE, SELECT, UPDATE, INSERT ON db_name.* TO 'db_migrations_user'@'localhost';`
6. `GRANT DELETE, SELECT, UPDATE, INSERT ON db_name.* TO 'db_crud_user'@'localhost';`

**_DB settings_**
<br>Set<br>`DB_HOST, DB_USER, DB_PASS, DB_NAME`
<br>in .env.* files(Reference: <a href="https://www.npmjs.com/package/dotenv-flow">dotenv-flow</a>)

**_Migrations_**
<br>Take a look on package.json script section:
<br>`"migrate:dev": "NODE_ENV=migrationsDev knex migrate:latest"`,
<br>`"migrate:prod": "NODE_ENV=migrationsProd knex migrate:latest"`,
<br>`"rollback:dev": "NODE_ENV=migrationsDev knex migrate:rollback"`
<br>_Note:_
<br>Table with FK have to be created before related table.
<br>Running any knex migrate command, it will use NODE_ENV implicitly.(Reference: <a href="https://knexjs.org/">knex migrate</a>)

**Step-by-Step**
1. Make previous actions(Database, DB settings)
2. It'll create knex system tables(knex_migrations_lock and knex_migrations)
<br>`npm run migrate:dev`
3. knex_migrations_lock and knex_migrations tables will be created, and fail with error like this:
<br>`Error: ER_TABLEACCESS_DENIED_ERROR: SELECT command denied to user 'db_migrations_user'@'localhost' for table 'knex_migrations_lock'`
4. Grant CRUD privileges to migrations user on db_name.knex_migrations_lock and db_name.knex_migrations.
<br>Migrations user CRUD data about migrations(created tables, to rollback, etc) in that tables.
<br>We cannot grant privileges on non existing table, that's why we have to create that tables before.
<br>`GRANT SELECT, UPDATE, DELETE, INSERT ON db_name.knex_migrations TO 'db_migrations_user'@'localhost';`
<br>`GRANT SELECT, UPDATE, DELETE, INSERT ON db_name.knex_migrations_lock TO 'db_migrations_user'@'localhost';`

**Seeds**
<br>Аfter the tables are created fill the tables with data. Use only for development and testing
<br>Run script(package.json scripts):
<br>`"seeds:dev": "NODE_ENV=development knex seed:run"`
