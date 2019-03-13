define([], function () {
    'use strict';
    return {
        analyticsgenerateAnsible: function (analyticsModel) {
            console.log("Generate Analytics Ansible Scripts..");
            console.log(analyticsModel);
            // webModel.
            var readJSON = JSON.parse(analyticsModel);
            var AppType = readJSON['dataAnalyticsModel']['AppType'];
            var name = readJSON['dataAnalyticsModel']['AppName'];
            var hostip = readJSON['dataAnalyticsModel']['host_ip'];
            var srcPath = readJSON['dataAnalyticsModel']['srcPath'];
            var analyticsEngine = readJSON['dataAnalyticsModel']['analyticsEngine'];
            console.log(analyticsEngine);
            var ostype = readJSON['dataAnalyticsModel']['OS']['name'];
            var osversion = readJSON['dataAnalyticsModel']['OS']['version'];
            var jupyter = readJSON['dataAnalyticsModel']['jupyter'];
            var platformVersion = readJSON['dataAnalyticsModel']['platformVersion'];
            var called = false;
            console.log(jupyter);

            // MySQL driver
            var mysql = require('mysql');
            var replace = require("replace");
            // var conn = mysql.createConnection({
            //     host: "127.0.0.1",
            //     user: "root",
            //     password: "isislab"
            // });
            var analyticspool;

            analyticspool = mysql.createPool({
                connectionLimit: 100,
                host: '129.59.234.224',
                user: 'root',
                password: 'isislab',
                port: 3306,
                debug: false,
                multipleStatements: true,
                acquireTimeout: Number.POSITIVE_INFINITY,
                queueLimit: 50
            });


            // Connect to Database
            // conn.connect(function (err) {
            //     if (err) throw err;
            //     console.log("Connected!");
            // });

            // Create ansible file for WebServer
            var fs = require('fs');
            var fs = require('fs-extra')
            var path = require("path");
            var scriptdir = path.resolve(".");
            var mkdirp = require('mkdirp')
            scriptdir += "/examples/ansibleScript/";
            scriptdir += "Application";
            scriptdir += Math.floor(Date.now());
            // console.log(scriptdir);
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

            //if (fs.existsSync(scriptdir))
            var hostfile = scriptdir + '/' + 'hosts';
            console.log(hostfile);

            if (platformVersion == "python3") {
                var hostContent = "[appserver]\n";
                hostContent += hostip;
                hostContent += " ansible_connection=ssh ansible_user=ubuntu ansible_python_interpreter=/usr/bin/python3\n";
            }
            else {
                var hostContent = "[appserver]\n";
                hostContent += hostip;
                hostContent += " ansible_connection=ssh ansible_user=ubuntu ansible_python_interpreter=/usr/bin/python\n";
            }
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
            // console.log(deployFile);
            if (fs.exists(deployFile)) {
                //console.log('deploydir: ' + deploydir);
                var siteTempfile = deploydir + "/templates/siteTemp";
                console.log(siteTempfile);
                //Read the header file
                var siteTemp = fs.readFileSync(siteTempfile, 'utf8');

                fs.writeFileSync(deployFile, siteTemp);

                if (platformVersion == "python3") {
                    replace({
                        regex: "python2",
                        replacement: "python3",
                        paths: [deployFile],
                        recursive: true,
                        silent: true,
                    });
                    replace({
                        regex: "python-minimal",
                        replacement: "python3",
                        paths: [deployFile],
                        recursive: true,
                        silent: true,
                    });
                }

            }

            var chnghostip = "ubuntu@" + hostip;
            var replace = require("replace");
            replace({
                regex: "ubuntu@<<ip>>",
                replacement: chnghostip,
                paths: [deployFile],
                recursive: true,
                silent: false,
            });

            var invars = "\n\n- include: dataanalyticsapp.yml";

            fs.appendFileSync(deployFile, invars);

            var analyticsAppdeployFile = scriptdir + '/' + 'dataanalyticsapp.yml';
            var analyticsAppTempfile = deploydir + "/templates/analyticsAppTemp";
            var analyticsApptemp = fs.readFileSync(analyticsAppTempfile, 'utf8');

            fs.writeFileSync(analyticsAppdeployFile, analyticsApptemp);
            var vars = "\n\n  vars:\n";
            vars += "    - path: " + srcPath;
            // console.log(vars);
            fs.appendFileSync(analyticsAppdeployFile, vars);

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
                    console.log('Role Directory ' + directory + ' created.');
                }
            });
            // Creating Main Task file
            var mainTaskFile = roleTaskDir + "/" + "main.yml";
            //language
            fs.writeFileSync(mainTaskFile, "---\n");


            console.log(analyticsEngine.length);
            for (var i = 0; i < analyticsEngine.length; i++) {
                console.log(analyticsEngine[i].toLowerCase());
                console.log(i);
                if (analyticsEngine[i].toLowerCase() == "scikitlearn") {
                    var scikit_sql = "SELECT b.pkg_name FROM softwaredependency.packages b ,softwaredependency.swdependency a where b.app_id=a.id and a.AppType='" + analyticsEngine[i].toLowerCase() + "'";
                    scikit_sql += "and b.sw_id in (select app_sw_id FROM softwaredependency.os_dependency where os_id in (SELECT id FROM softwaredependency.os_pkg_mgr ";
                    scikit_sql += "where concat(OS_type,OS_version) = '" + ostype + osversion + "'))";
                    console.log(scikit_sql);
                    var install_analyticsEngine = "- include: install_" + analyticsEngine[i].toLowerCase() + ".yml\n";

                    fs.appendFileSync(mainTaskFile, install_analyticsEngine);
                    console.log(install_analyticsEngine);

                    var ubuntu_pkg_vars = "\n\n      ubuntu_" + analyticsEngine[i].toLowerCase() + "_pkgs:\n";
                    ubuntu_pkg_vars += "        <<packages>>"
                    fs.appendFileSync(analyticsAppdeployFile, ubuntu_pkg_vars);
                    console.log(analyticsAppdeployFile);
                    var pkg_result = "";
                    var replace = require("replace");
                    var sleep = require('sleep');
                    analyticspool.on('acquire', function (connection) {
                        console.log('Connection %d acquired', connection.threadId);
                    });


                    function analyticshandleDisconnect() {
                        // Query the DataBase
                        analyticspool.getConnection(function (err, connection) {
                            console.log("analyticspool connecting...");
                            sleep.sleep(1);
                            if (err) {
                                console.log(err);
                                //connection.release();
                                setTimeout(analyticshandleDisconnect, 2000);
                            }
                            else {
                                connection.query(scikit_sql, function (err, rows) {
                                    connection.release();

                                    if (err) {
                                        console.error('error running query', err);
                                        setTimeout(analyticshandleDisconnect, 2000);
                                    } else {
                                        console.log("analyticspool connected...");
                                        console.log(rows);
                                        for (var row in rows) {
                                            var rowResult = "         - " + rows[row].pkg_name;
                                            console.log(rowResult);
                                            pkg_result += rowResult + "\n";
                                        }
                                        if (pkg_result.length > 0) {
                                            replace({
                                                regex: "        <<packages>>",
                                                replacement: pkg_result,
                                                paths: [analyticsAppdeployFile],
                                                recursive: true,
                                                silent: true,
                                            });
                                            if (platformVersion == "python3" && called === false) {
                                                replace({
                                                    regex: "python",
                                                    replacement: "python3",
                                                    paths: [analyticsAppdeployFile],
                                                    recursive: true,
                                                    silent: true,
                                                });
                                            }
                                            if (jupyter === false)
                                                callback();
                                            else if (called === false) {
                                                jupytercallback();
                                                called = true;
                                            }

                                        }
                                    }
                                });

                            }
                        });
                    }

                    analyticshandleDisconnect();

                    console.log(ostype + osversion);
                    var scikitTempFile;
                    // if ((ostype + osversion).toLowerCase() === "ubuntu16.04")
                    scikitTempFile = deploydir + "/templates/scikitTemp";
                    // else if ((ostype + osversion).toLowerCase() === "ubuntu14.04")
                    //     mysqlTempFile = deploydir + "/templates/PHP14Temp";
                    console.log(scikitTempFile);
                    //Read the header file
                    var scikitTemp = fs.readFileSync(scikitTempFile, 'utf8');

                    // Creating Task file
                    var scikitTaskFile = roleTaskDir + "/" + "install_" + analyticsEngine[i].toLowerCase() + ".yml";
                    console.log(scikitTaskFile);
                    fs.writeFile(scikitTaskFile, scikitTemp, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log("The scikit file was generated!");
                    });

                    var copyCode = "- include: copy_code.yml\n";
                    fs.appendFileSync(mainTaskFile, copyCode);
                    //Read the header file
                    var copyTempfile = deploydir + "/templates/copy_code_Scikit";
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

                }

                if (analyticsEngine[i].toLowerCase() == "tensorflow") {
                    var tensorflow_sql = "SELECT b.pkg_name FROM softwaredependency.packages b ,softwaredependency.swdependency a where b.app_id=a.id and a.AppType='" + analyticsEngine[i].toLowerCase() + "'";
                    tensorflow_sql += "and b.sw_id in (select app_sw_id FROM softwaredependency.os_dependency where os_id in (SELECT id FROM softwaredependency.os_pkg_mgr ";
                    tensorflow_sql += "where concat(OS_type,OS_version) = '" + ostype + osversion + "'))";
                    console.log(tensorflow_sql);
                    var install_analyticsEngine = "- include: install_" + analyticsEngine[i].toLowerCase() + ".yml\n";

                    fs.appendFileSync(mainTaskFile, install_analyticsEngine);
                    console.log(mainTaskFile);
                    console.log(install_analyticsEngine);

                    var ubuntu_pkg_vars = "\n\n      ubuntu_" + analyticsEngine[i].toLowerCase() + "_pkgs:\n";
                    ubuntu_pkg_vars += "        <<packages>>"
                    fs.appendFileSync(analyticsAppdeployFile, ubuntu_pkg_vars);
                    console.log(analyticsAppdeployFile);
                    var pkg_result = "";
                    var replace = require("replace");
                    var sleep = require('sleep');
                    analyticspool.on('acquire', function (connection) {
                        console.log('Connection %d acquired', connection.threadId);
                    });


                    function analyticshandleDisconnect() {
                        // Query the DataBase
                        analyticspool.getConnection(function (err, connection) {
                            console.log("analyticspool connecting...");
                            sleep.sleep(1);
                            if (err) {
                                console.log(err);
                                //connection.release();
                                setTimeout(analyticshandleDisconnect, 2000);
                            }
                            else {
                                connection.query(tensorflow_sql, function (err, rows) {
                                    connection.release();

                                    if (err) {
                                        console.error('error running query', err);
                                        setTimeout(analyticshandleDisconnect, 2000);
                                    } else {
                                        console.log("analyticspool connected...");
                                        console.log(rows);
                                        for (var row in rows) {
                                            var rowResult = "         - " + rows[row].pkg_name;
                                            console.log(rowResult);
                                            pkg_result += rowResult + "\n";
                                        }
                                        if (pkg_result.length > 0) {
                                            replace({
                                                regex: "        <<packages>>",
                                                replacement: pkg_result,
                                                paths: [analyticsAppdeployFile],
                                                recursive: true,
                                                silent: true,
                                            });
                                            if (platformVersion == "python3" && called === false) {
                                                replace({
                                                    regex: "python",
                                                    replacement: "python3",
                                                    paths: [analyticsAppdeployFile],
                                                    recursive: true,
                                                    silent: true,
                                                });
                                            }
                                            if (jupyter === false)
                                                callback();
                                            else if (called === false) {
                                                jupytercallback();
                                                called = true;
                                            }
                                        }
                                    }
                                });

                            }
                        });
                    }

                    analyticshandleDisconnect();

                    console.log(ostype + osversion);
                    var tensorflowTempFile;
                    // if ((ostype + osversion).toLowerCase() === "ubuntu16.04")
                    tensorflowTempFile = deploydir + "/templates/tensorflowTemp";
                    // else if ((ostype + osversion).toLowerCase() === "ubuntu14.04")
                    //     mysqlTempFile = deploydir + "/templates/PHP14Temp";
                    console.log(tensorflowTempFile);
                    //Read the header file
                    var tensorflowTemp = fs.readFileSync(tensorflowTempFile, 'utf8');

                    // Creating Task file
                    var tensorflowTaskFile = roleTaskDir + "/" + "install_" + analyticsEngine[i].toLowerCase() + ".yml";
                    console.log(tensorflowTaskFile);
                    fs.writeFile(tensorflowTaskFile, tensorflowTemp, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log("The tensorflow file was generated!");
                    });

                    var copyCode = "- include: copy_code.yml\n";
                    fs.appendFileSync(mainTaskFile, copyCode);
                    //Read the header file
                    var copyTempfile = deploydir + "/templates/copy_code_Scikit";
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

                }
            }

            var roles = "\n\n  roles:\n";
            roles += "    - " + name;
            fs.appendFileSync(analyticsAppdeployFile, roles);


            var cp = require('shelljs');
            // var command = "ansible-playbook -i hosts " + deployFile;
            var command = "nohup ansible-playbook -i hosts " + deployFile + " &";
            console.log(command);
            var exec = cp.exec;


            var sleep = require('sleep');
            sleep.sleep(1);

            function jupytercallback() {

                var jupAppdeployFile = scriptdir + '/' + 'jupyter.yml';
                var jupAppTempfile = deploydir + "/templates/analyticsAppTemp";
                var jupApptemp = fs.readFileSync(jupAppTempfile, 'utf8');

                fs.writeFileSync(jupAppdeployFile, analyticsApptemp);
                var vars = "\n\n  vars:\n";

                // console.log(vars);
                fs.appendFileSync(jupAppdeployFile, vars);

                //  Creating Application directory in roles directory
                var juproleAppDir = roleDir + "/" + "jupyter";
                fs.ensureDirSync(juproleAppDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role Directory ' + juproleAppDir + ' created.');
                    }
                });

                // Creating Tasks directory in Application directory
                var juproleAppDir = roleDir + "/" + "jupyter";
                fs.ensureDirSync(juproleAppDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role Directory ' + juproleAppDir + ' created.');
                    }
                });
                // Creating Main Task file
                var juproleTaskDir = juproleAppDir + "/" + "tasks";
                fs.ensureDirSync(juproleTaskDir, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role Directory ' + juproleTaskDir + ' created.');
                    }
                });
                // Creating Main Task file
                var mainTaskFile = juproleTaskDir + "/" + "main.yml";
                //language
                fs.writeFileSync(mainTaskFile, "---\n");
                fs.appendFileSync(mainTaskFile, "- include: install_jupyter.yml");


                var juproles = "\n- include: jupyter.yml";
                fs.appendFileSync(deployFile, juproles);

                var jupyter_sql = "SELECT b.pkg_name FROM softwaredependency.packages b ,softwaredependency.swdependency a where b.app_id=a.id and a.AppType='jupyter'";
                jupyter_sql += "and b.sw_id in (select app_sw_id FROM softwaredependency.os_dependency where os_id in (SELECT id FROM softwaredependency.os_pkg_mgr ";
                jupyter_sql += "where concat(OS_type,OS_version) = '" + ostype + osversion + "'))";
                console.log(jupyter_sql);


                var ubuntu_pkg_vars = "\n     - ubuntu_jupyter_pkgs:\n";
                ubuntu_pkg_vars += "        <<packages>>"
                // fs.appendFileSync(jupAppdeployFile, ubuntu_pkg_vars);
                console.log(jupAppdeployFile);
                var jup_pkg_result = "";
                var replace = require("replace");
                var sleep = require('sleep');
                // analyticspool.on('acquire', function (connection) {
                //     console.log('Connection %d acquired', connection.threadId);
                // });


                function jupyterhandleDisconnect() {
                    // Query the DataBase
                    analyticspool.getConnection(function (err, connection) {
                        console.log("analyticspool connecting...");
                        sleep.sleep(1);
                        if (err) {
                            console.log(err);
                            //connection.release();
                            setTimeout(jupyterhandleDisconnect, 2000);
                        }
                        else {
                            connection.query(jupyter_sql, function (err, rows) {
                                connection.release();

                                if (err) {
                                    console.error('error running query', err);
                                    setTimeout(jupyterhandleDisconnect, 2000);
                                } else {
                                    console.log("analyticspool connected...");
                                    console.log(rows);
                                    for (var row in rows) {
                                        var rowResult = "         - " + rows[row].pkg_name;
                                        console.log(rowResult);
                                        jup_pkg_result += rowResult + "\n";
                                    }
                                    // if (jup_pkg_result.length > 0) {
                                    //     replace({
                                    //         regex: "        <<packages>>",
                                    //         replacement: jup_pkg_result,
                                    //         paths: [jupAppdeployFile],
                                    //         recursive: true,
                                    //         silent: true,
                                    //     });
                                    //     callback();
                                    // }
                                    callback();
                                }
                            });

                        }
                    });
                }

                jupyterhandleDisconnect();


                var jupyterTempFile;
                // if ((ostype + osversion).toLowerCase() === "ubuntu16.04")
                jupyterTempFile = deploydir + "/templates/jupyterScikitTemp";
                // else if ((ostype + osversion).toLowerCase() === "ubuntu14.04")
                //     mysqlTempFile = deploydir + "/templates/PHP14Temp";
                console.log(jupyterTempFile);
                //Read the header file
                var jupyterTemp = fs.readFileSync(jupyterTempFile, 'utf8');

                // Creating Task file
                var jupyterTaskFile = juproleTaskDir + "/" + "install_jupyter.yml";
                console.log(jupyterTaskFile);
                fs.writeFile(jupyterTaskFile, jupyterTemp, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The scikit file was generated!");
                    if (platformVersion == "python3") {
                        replace({
                            regex: "python",
                            replacement: "python3",
                            paths: [jupyterTaskFile],
                            recursive: true,
                            silent: true,
                        });
                    }
                });

                var juproles = "\n\n  roles:\n";
                juproles += "    - " + "jupyter";
                fs.appendFileSync(jupAppdeployFile, juproles);

            }


            function callback() {
                sleep.sleep(1);
                var shell = require('shelljs');
                shell.cd(scriptdir);
                // var command = "ansible-playbook -i hosts " + deployFile;
                var command = "nohup ansible-playbook -i hosts " + deployFile + " &";
                console.log(command);
                //exec(command);
                var sshCmd = "ssh ubuntu@" + hostip + " echo 'hello'";
                console.log(sshCmd);


                // analyticspool.end();
                // while (true) {
                var hello = shell.exec(sshCmd).stdout;
                // console.log(hello);

                var runjupyterNotebook = "ssh ubuntu@" + hostip + " jupyter notebook";
                var decoratorFix = "ssh ubuntu@" + hostip + " sudo apt install -y --reinstall python" + "\\*-decorator";
                console.log(decoratorFix);
                if (hello === 'hello\n') {
                    console.log("hello");
                    shell.exec(command, {async:true});
                    //break;
                }
                else
                    setTimeout(callback, 30000);
                // }
                shell.exec(decoratorFix).stdout;
                shell.exec(runjupyterNotebook).stdout;
            }
        }
    }
});

