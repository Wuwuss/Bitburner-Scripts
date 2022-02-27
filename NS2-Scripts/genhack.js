/** @param {NS} ns **/

export async function main(ns) {
	const target_server = ns.args[0];
	
	// Shows an alert to the user if they don't assign a target server.
	if (target_server === undefined) {
		ns.alert('Specify a target server!');
		return
	}
	
	let hack_count = 0;
	let grow_count = 0;
	let weaken_count = 0;
	const should_hack = ns.args[1] = false;
	const max_money = ns.getServerMaxMoney(target_server) * 0.75; // Edit this number to change the Available Money Threshold. Default; * 0.75.
	const base_sec = ns.getServerMinSecurityLevel(target_server) * 1.25; // Edit this number to change the Security Level Threshold. Default; * 1.25.
	
	// Attempts to use all available programs to open any ports, and gain root access.
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target_server);
	}
	
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target_server);
	}
	
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target_server);
	}
	
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target_server);
	}
		
	if (ns.hasRootAccess(target_server) == false) {
		ns.nuke(target_server);
	}
	/**-----------------------------------------**/

	// Checks if the script has access to Root, and if the variable 'should_hack' was false or unspecified. Exits script.
	if (should_hack == false, ns.hasRootAccess(target_server) == true) {
		ns.tprint("Not hacking, variable 'should_hack' was false or unspecified.");
		return
	}
	
	// Checks if the script has access to Root, and exits if it doesn't.
	if (ns.hasRootAccess(target_server) == false) {
		ns.tprint('No access to root! Exiting script.');
		return
	}
	
	/*
	Disabled by default due to RAM limitations, enable if you can run a 34.80gb script.
	ns.installBackdoor(target_server);
	*/
	
	// Repeatedly weakens, grows, or hacks the target server if variable 'should_hack' is true.
	while (should_hack == true) {
		// Checks if the target server is below the Security Threshold, and uses weaken() if it isn't.
		if (ns.getServerSecurityLevel(target_server) > base_sec) {
			weaken_count++;
			ns.print('-----Beginning Weaken ' + weaken_count + '-----');
			await ns.weaken(target_server);
			ns.print('-----Security Level decreased to ' + ns.getServerSecurityLevel(target_server) + '-----');
		}
		// Checks if the target server is above the Available Money Threshold, and uses grow() if it isn't.
		else if (ns.getServerMoneyAvailable(target_server) < max_money) {
			grow_count++;
			ns.print('-----Beginning Grow ' + grow_count + '-----');
			await ns.grow(target_server);
			ns.print('-----Available Money increased to ' + ns.getServerMoneyAvailable(target_server) + '-----');
		}
		// Hacks the target server, and prints the Security Level and Available Money afterwards.
		else {
			hack_count++;
			ns.print('-----Beginning Hack ' + hack_count + '-----');
			await ns.hack(target_server);
			ns.print('-----Security Level increased to ' + ns.getServerSecurityLevel(target_server) + '-----');
			ns.print('-----Available Money decreased to ' + ns.getServerMoneyAvailable(target_server) + '-----');
			}
		}
	}
