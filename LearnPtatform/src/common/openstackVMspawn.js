define([], function() {
    'use strict';
    return {
        spawnVM: function(dataModel) {
            var self = this;

            console.log("Spwaning VMs..");
            //console.log(dataModel);

            var readJSON = JSON.parse(dataModel);
            var vmName = readJSON['ansibleModel']['VMName'];
            //console.log(vmName);
            var hostname = readJSON['ansibleModel']['hostname'];
            //console.log(image);
            var flavor_name = readJSON['ansibleModel']['flavor_name'];
            //console.log(flavor_name);

            var network = readJSON['ansibleModel']['network'];
            var imageName = readJSON['ansibleModel']['imageName'];
            var keyName = readJSON['ansibleModel']['keyName'];

            var ostype = readJSON['ansibleModel']['OS']['name'];
            var osversion = readJSON['ansibleModel']['OS']['version'];

            var image = ostype.toLowerCase() +osversion;
            console.log(image);

            if (hostname.trim() === '')
                var variables = "VM_Name=" + vmName + " Image_Name=" + imageName + " Flavor_Name=" + flavor_name  + " Network_Name=" + network + " Key_Name=" + keyName;
            else
                var variables = "VM_Name=" + vmName + " Image_Name=" + imageName + " Flavor_Name=" + flavor_name + " Host_Name=" + "nova:" + hostname + " Network_Name=" + network + " Key_Name=" + keyName;
            console.log(variables);

            var shell = require('shelljs');
            var sleep = require('sleep');

            var command = "nohup ansible-playbook ";

            command += "src/plugins/ansibleVMspawn/openstackVMspawnfp.yml ";
            // command += "src/plugins/ansibleVMspawn/openstackVMspawn.yml ";
            command += "--extra-vars ";
            command += '" ' + variables + ' " &';
            console.log(command);
            console.log(command.length);
            var fs = require('fs');
            // var openstack_ip = "openstack server list --name " + vmName + "| grep " + network +  "| awk '{print $8}'| awk -F'=' '{print $2}' > src/plugins/ansibleVMspawn/hostTemp"+vmName;
            var openstack_ip = "openstack server list --name " + vmName + "| grep " + network + "| awk \'{print $9}\'| tail -2 > src/plugins/ansibleVMspawn/hostTemp" + vmName;

            // console.log(openstack_ip);
            sleep.sleep(1);
            var promise =
                shell.exec(command, {async: true});

            promise.stdout.on('data', function (data) {
                sleep.sleep(1);
                shell.exec(openstack_ip).stdout;
            });

        }
    }
});

