define([], function () {
    'use strict';
    return {
        dbgenerateAnsible: function (dbModel) {

            console.log("Generate DB Ansible Scripts..");
            console.log(dbModel);
            // webModel.
            var readJSON = JSON.parse(dbModel);
            var AppType = readJSON['DBApplicationModel']['AppType'];
            var name = readJSON['DBApplicationModel']['AppName'];
            var hostip = readJSON['DBApplicationModel']['host_ip'];
            var srcPath = readJSON['DBApplicationModel']['srcPath'];
            var dbuser = readJSON['DBApplicationModel']['user'];
            var dbpassword = readJSON['DBApplicationModel']['password'];
            var dbEngine = readJSON['DBApplicationModel']['dbEngine'];
            var dbnames = readJSON['DBApplicationModel']['dbnames'];
            var dbLocation = readJSON['DBApplicationModel']['dbLocation'];
            var port = readJSON['DBApplicationModel']['port'];
            var ostype = readJSON['DBApplicationModel']['OS']['name'];
            var osversion = readJSON['DBApplicationModel']['OS']['version'];

            // console.log(AppType);
            // console.log(name);
            // console.log(srcPath);
            console.log(dbuser);
            //
            // console.log(dbpassword);
            // console.log(port);
            //
            // console.log(dbEngine);
            //
            // console.log(hostip);
            // console.log(ostype);
            // console.log(osversion);

            // MySQL driver
            var mysql = require('mysql');
            var replace = require("replace");
            var sleep = require('sleep');
            sleep.sleep(5);
            // var conn = mysql.createConnection({
            //     host: "127.0.0.1",
            //     user: "root",
            //     password: "isislab"
            // });
            var dbpool;

            dbpool = mysql.createPool({
                connectionLimit: 10,
                host: '129.59.234.224',
                user: 'root',
                port: 3306,
                password: 'isislab',
                debug: false,
                multipleStatements: true,
                acquireTimeout: Number.POSITIVE_INFINITY,
                queueLimit: 10
            });

            // Create ansible file for DBServer
            var fs = require('fs');
            var fs = require('fs-extra')
            var path = require("path");
            var scriptdir = path.resolve(".");
            var mkdirp = require('mkdirp')
            scriptdir += "/examples/ansibleScript/";
            scriptdir += "Application";
            scriptdir += Math.floor(Date.now());
            console.log(scriptdir);
            // if (fs.existsSync(scriptdir)) {
            //     console.log("Deleting: ", scriptdir);
            //     deleteDirectory(scriptdir);
            //     console.log("Deleted: ", scriptdir);
            // }
            fs.ensureDirSync(scriptdir, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Directory ' + directory + ' created.');
                }
            });

            var hostfile = scriptdir + '/' + 'hosts';
            console.log(hostfile);

            var hostContent = "[dbserver]\n";
            hostContent += hostip;
            hostContent += " ansible_connection=ssh ansible_user=ubuntu ansible_python_interpreter=/usr/bin/python\n";
            //console.log (hostContent);

            if (fs.exists(hostfile)) {
                console.log("The host file is appending..!");
                fs.appendFile(hostfile, hostContent, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The host file was appended!");
                });
            }
            else {
                fs.writeFileSync(hostfile, hostContent, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The host file was saved!");
                });
            }

            //Genarating to the main playbook

            var deploydir = path.resolve(".");
            var deployFile = scriptdir + '/' + 'site.yml';
            console.log(deployFile);
            if (fs.exists(deployFile)) {
                //console.log('deploydir: ' + deploydir);
                var siteTempfile = deploydir + "/templates/siteTemp";
                console.log(siteTempfile);
                //Read the header file
                var siteTemp = fs.readFileSync(siteTempfile, 'utf8');

                fs.writeFileSync(deployFile, siteTemp);
            }

            var invars = "\n\n- include: dbapp.yml";

            fs.appendFileSync(deployFile, invars);

            console.log("scriptdir", scriptdir);


            var dbdeployFile = scriptdir + '/' + 'dbapp.yml';
            var LAMPdbTempfile = deploydir + "/templates/LAMPdbTemp";
            var LAMPdbTemp = fs.readFileSync(LAMPdbTempfile, 'utf8');
            console.log("srcPath", srcPath);
            fs.writeFileSync(dbdeployFile, LAMPdbTemp);
            var _vars = "\n\n  vars:\n";
            _vars += "    - path: " + srcPath;
            console.log(_vars);
            fs.appendFileSync(dbdeployFile, _vars);

            // Creating roles directory
            var roleDir = scriptdir + "/roles";

            fs.ensureDirSync(roleDir, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Role Directory ' + directory + ' created.');
                }
            });

            //  Creating Application directory in roles directory
            var roleAppDir = roleDir + "/" + name;
            fs.ensureDirSync(roleAppDir, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Role Directory ' + directory + ' created.');
                }
            });

            // Creating Tasks directory in Application directory
            var roleAppDir = roleDir + "/" + name;
            fs.ensureDirSync(roleAppDir, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Role Directory ' + directory + ' created.');
                }
            });
            // Creating Main Task file
            var roleTaskDir = roleAppDir + "/" + "tasks";
            fs.ensureDirSync(roleTaskDir, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Task Directory ' + directory + ' created.');
                }
            });
            // Creating Main Task file
            var mainTaskFile = roleTaskDir + "/" + "main.yml";
            //user
            fs.writeFileSync(mainTaskFile, "---\n");


            if (dbEngine.toLowerCase() == "mysql") {
                var copyCode = "- include: copy_code.yml\n";
                fs.appendFileSync(mainTaskFile, copyCode);
                //Read the header file
                var copyTempfile = deploydir + "/templates/copy_code_LAMP";
                var copyTemp = fs.readFileSync(copyTempfile, 'utf8');
                // Creating Copy-code file
                var copyTaskFile = roleTaskDir + "/" + "copy_code.yml";
                console.log(copyTaskFile);
                fs.writeFile(copyTaskFile, copyTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The copy file was generated!");
                });

                var sql = "SELECT b.pkg_name FROM softwaredependency.packages b ,softwaredependency.swdependency a where b.app_id=a.id and a.AppType='" + dbEngine.toLowerCase() + "'";
                sql += "and b.sw_id in (select app_sw_id FROM softwaredependency.os_dependency where os_id in (SELECT id FROM softwaredependency.os_pkg_mgr ";
                sql += "where concat(OS_type,OS_version) = '" + ostype + osversion + "'))";
                console.log(sql);
                var install_dbEngine = "- include: install_" + dbEngine.toLowerCase() + ".yml\n";

                fs.appendFileSync(mainTaskFile, install_dbEngine);
                console.log(install_dbEngine);

                var mysqlconf = "\n      mysql_port: " + port + "\n"; //3306 #Default is 3306, please change it if you are using non-standard\n";
                mysqlconf += "      mysql_bind_address: \"0.0.0.0\" \n" //#Change it to 0.0.0.0,if you want to listen everywhere\n";
                mysqlconf += "      mysql_user: " + dbuser + "\n"; //root\n";
                mysqlconf += "      mysql_root_pass: " + dbpassword + "\n"; // admin #MySQL Root Password\n";
                console.log(mysqlconf);
                fs.appendFileSync(dbdeployFile, mysqlconf);


                var ubuntu_pkg_vars = "\n\n      ubuntu_" + dbEngine.toLowerCase() + "_pkgs:\n";
                ubuntu_pkg_vars += "        <<packages>>"
                fs.appendFileSync(dbdeployFile, ubuntu_pkg_vars);
                console.log(dbdeployFile);
                var pkg_result = "";
                var replace = require("replace");
                var sleep = require('sleep');

                // Query the DataBase
                function sqlhandleDisconnect() {
                    dbpool.getConnection(function (err, connection) {
                        console.log("DBpool connecting...");
                        sleep.sleep(1);
                        if (err) {
                            console.log(err);
                            //connection.release();
                            setTimeout(sqlhandleDisconnect, 2000);
                        }
                        else {
                            connection.query(sql, function (err, rows) {
                                connection.release();
                                if (err) {
                                    console.error('error running query', err);
                                    setTimeout(sqlhandleDisconnect, 2000);
                                } else {
                                    console.log("DBpool connected...");
                                    // console.log(rows);
                                    for (var row in rows) {
                                        var rowResult = "         - " + rows[row].pkg_name;
                                        console.log(rowResult);
                                        pkg_result += rowResult + "\n";
                                    }
                                    if (pkg_result.length > 0) {
                                        replace({
                                            regex: "        <<packages>>",
                                            replacement: pkg_result,
                                            paths: [dbdeployFile],
                                            recursive: true,
                                            silent: true,
                                        });
                                        callback();
                                    }
                                }
                            });

                        }
                    });
                }

                sqlhandleDisconnect();


                console.log(ostype + osversion);
                var mysqlTempFile = deploydir + "/templates/mysqlTemp";

                console.log(mysqlTempFile);
                //Read the header file
                var mysqlTemp = fs.readFileSync(mysqlTempFile, 'utf8');

                // Creating Task file
                var mysqlTaskFile = roleTaskDir + "/" + "install_" + dbEngine.toLowerCase() + ".yml";
                console.log(mysqlTaskFile);
                fs.writeFileSync(mysqlTaskFile, mysqlTemp);//, function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                //
                //     console.log("The node file was generated!");
                // });

                var dbname = dbnames.split(",");
                var dbLoc = dbLocation.split(",");

                for (var a = 0; a < dbname.length; a++) {
                    var nameval = dbname[a];
                    var locval = dbLoc[a];
                    console.log(nameval, "-----", locval);
                    var adddb = "\n- name: Create Application Database\n";
                    adddb += "  mysql_db: name=" + nameval + " state=import target=/var/www/html/" + locval + "\n";
                    console.log(adddb);
                    fs.appendFileSync(mysqlTaskFile, adddb);
                }

                var appdbuser = "- name: Create Application DB User\n";
                appdbuser += "  mysql_user: name={{ mysql_user }} password={{ mysql_root_pass }} priv=*.*:ALL host='%' state=present\n"
                fs.appendFileSync(mysqlTaskFile, appdbuser);

                // Creating Template files
                var roleTempDir = roleAppDir + "/" + "templates";
                fs.ensureDirSync(roleTempDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role Directory ' + directory + ' created.');
                    }
                });

                //Read the header file
                var cnfiniTempfile;
                if ((ostype + osversion).toLowerCase() === "ubuntu16.04")
                    cnfiniTempfile = deploydir + "/templates/my.cnf.j2Temp16";
                else if ((ostype + osversion).toLowerCase() === "ubuntu14.04")
                    cnfiniTempfile = deploydir + "/templates/my.cnf.j2Temp14";
                console.log(mysqlTempFile);

                var cnfiniTemp = fs.readFileSync(cnfiniTempfile, 'utf8');
                // Creating Copy-code file
                var cnfiniTempFile = roleTempDir + "/" + "my.cnf.j2";
                console.log(cnfiniTempFile);
                fs.writeFile(cnfiniTempFile, cnfiniTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The my.cnf.j2 file was generated!");
                });


                //Read the header file
                var confTempfile = deploydir + "/templates/root.cnf.j2Temp";
                var confTemp = fs.readFileSync(confTempfile, 'utf8');
                // Creating Copy-code file
                var confTempFile = roleTempDir + "/" + "root.cnf.j2";
                console.log(confTempFile);
                fs.writeFile(confTempFile, confTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The root.cnf.j2 file was generated!");
                });


                // Creating Handler files
                var roleHandlerDir = roleAppDir + "/" + "handlers";
                fs.ensureDirSync(roleHandlerDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Handler Directory ' + directory + ' created.');
                    }
                });

                //Read the header file
                var mysqlHandlerfile = deploydir + "/templates/mysqlHandler";
                var mysqlHandler = fs.readFileSync(mysqlHandlerfile, 'utf8');
                // Creating Copy-code file
                var mysqlHandlerFile = roleHandlerDir + "/" + "main.yml";
                console.log(mysqlHandlerFile);
                fs.writeFile(mysqlHandlerFile, mysqlHandler, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The mysqlHandler file was generated!");
                });
            }

            if (dbEngine.toLowerCase() == "mongodb") {

                var copyCode = "- include: copy_code.yml\n";
                fs.appendFileSync(mainTaskFile, copyCode);
                //Read the header file
                var copyTempfile = deploydir + "/templates/copy_code_LAMP";
                var copyTemp = fs.readFileSync(copyTempfile, 'utf8');
                // Creating Copy-code file
                var copyTaskFile = roleTaskDir + "/" + "copy_code.yml";
                console.log(copyTaskFile);
                fs.writeFile(copyTaskFile, copyTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The copy file was generated!");
                });

                var sql = "SELECT b.pkg_name FROM softwaredependency.packages b ,softwaredependency.swdependency a where b.app_id=a.id and a.AppType='" + dbEngine.toLowerCase() + "'";
                sql += "and b.sw_id in (select app_sw_id FROM softwaredependency.os_dependency where os_id in (SELECT id FROM softwaredependency.os_pkg_mgr ";
                sql += "where concat(OS_type,OS_version) = '" + ostype + osversion + "'))";
                console.log(sql);
                var install_dbEngine = "- include: install_" + dbEngine.toLowerCase() + ".yml\n";

                fs.appendFileSync(mainTaskFile, install_dbEngine);
                console.log(install_dbEngine);


                var mongoconf = "\n      mongo_port: " + port + "\n"; //270717
                mongoconf += "      mongo_bind_address: \"0.0.0.0\" \n" //#Change it to 0.0.0.0,if you want to listen everywhere\n";
                mongoconf += "      mongo_user: " + dbuser + "\n"; //root\n";
                mongoconf += "      mongo_root_pass: " + dbpassword + "\n"; // admin #MySQL Root Password\n";
                console.log(mongoconf);
                fs.appendFileSync(dbdeployFile, mongoconf);

                var ubuntu_pkg_vars = "\n\n      ubuntu_" + dbEngine.toLowerCase() + "_pkgs:\n";
                ubuntu_pkg_vars += "        <<packages>>"
                fs.appendFileSync(dbdeployFile, ubuntu_pkg_vars);
                console.log(dbdeployFile);
                var pkg_result = "";
                var replace = require("replace");
                var sleep = require('sleep');

                // Query the DataBase
                function sqlhandleDisconnect() {
                    dbpool.getConnection(function (err, connection) {
                        console.log("DBpool connecting...");
                        sleep.sleep(1);
                        if (err) {
                            console.log(err);
                            sqlhandleDisconnect();
                        }
                        else {
                            connection.query(sql, function (err, rows) {
                                connection.release();
                                if (err) {
                                    console.error('error running query', err);
                                } else {
                                    console.log("DBpool connected...");
                                    // console.log(rows);
                                    for (var row in rows) {
                                        var rowResult = "         - " + rows[row].pkg_name;
                                        console.log(rowResult);
                                        pkg_result += rowResult + "\n";
                                    }
                                    if (pkg_result.length > 0) {
                                        replace({
                                            regex: "        <<packages>>",
                                            replacement: pkg_result,
                                            paths: [dbdeployFile],
                                            recursive: true,
                                            silent: true,
                                        });
                                        callback();
                                    }
                                }
                            });

                        }
                    });
                }

                sqlhandleDisconnect();

                console.log(ostype + osversion);
                var mongoTempFile = deploydir + "/templates/mongodbTemp";

                console.log(mongoTempFile);
                //Read the header file
                var mongoTemp = fs.readFileSync(mongoTempFile, 'utf8');

                // Creating Task file
                var mongoTaskFile = roleTaskDir + "/" + "install_" + dbEngine.toLowerCase() + ".yml";
                console.log(mongoTaskFile);
                fs.writeFileSync(mongoTaskFile, mongoTemp);


                // Creating Template files
                var roleTempDir = roleAppDir + "/" + "templates";
                fs.ensureDirSync(roleTempDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role Directory ' + directory + ' created.');
                    }
                });

                //Read the header file
                var cnfiniTempfile = deploydir + "/templates/mongoTemp";
                console.log(mysqlTempFile);

                var cnfiniTemp = fs.readFileSync(cnfiniTempfile, 'utf8');
                // Creating Copy-code file
                var cnfiniTempFile = roleTempDir + "/" + "mongod.conf";
                console.log(cnfiniTempFile);
                fs.writeFile(cnfiniTempFile, cnfiniTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The mongod.conf file was generated!");
                });

                // Creating Handler files
                var roleHandlerDir = roleAppDir + "/" + "handlers";
                fs.ensureDirSync(roleHandlerDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Handler Directory ' + directory + ' created.');
                    }
                });

                //Read the header file
                var mongoHandlerfile = deploydir + "/templates/mongoHandler";
                var mongoHandler = fs.readFileSync(mongoHandlerfile, 'utf8');
                // Creating Copy-code file
                var mongoHandlerFile = roleHandlerDir + "/" + "main.yml";
                console.log(mongoHandlerFile);
                fs.writeFile(mongoHandlerFile, mongoHandler, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The mongoHandler file was generated!");
                });

            }

            var roles = "\n\n  roles:\n";
            roles += "    - " + name;
            fs.appendFileSync(dbdeployFile, roles);

            // End Database Connection
            // conn.end(function (err) {
            //     if (err) {
            //         throw err;
            //         console.log(err);
            //     }
            //     else {
            //         console.log("Disconnected!");
            //     }
            // });

            var cp = require('shelljs');
            var command = "nohup ansible-playbook -i hosts " + deployFile + " &";
            console.log(command);
            var exec = cp.exec;


            var sleep = require('sleep');

            function callback() {
                sleep.sleep(1);
                var shell = require('shelljs');
                shell.cd(scriptdir);
                var command = "nohup ansible-playbook -i hosts " + deployFile + " &";
                var exec = shell.exec;
                console.log(command);
                //exec(command);
                var sshCmd = "ssh ubuntu@" + hostip + " echo 'hello'";
                console.log(sshCmd);
                // dbpool.end();
                //while (true) {
                var hello = shell.exec(sshCmd).stdout;
                // console.log(hello);

                if (hello === 'hello\n') {
                    console.log("hello");
                    exec(command, {async:true});
                    console.log("done");
                    //break;
                }
                else
                    setTimeout(callback, 30000);
                //sleep.sleep(30);
                // }
            }
        }
    }
});