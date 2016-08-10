#pragma strict
var cameras : Camera[] = new Camera[2];

function Start () {
	cameras[0] = GameObject.Find("Main Camera").GetComponent("Camera");
	cameras[1] = GameObject.Find("Sub Camera").GetComponent("Camera");
	cameras[0].enabled = true;
	cameras[1].enabled = false;
}

function Update () {
}

function SelectCamera(selectID : int) {
	for(var i = 0; i < 2; i++) {
		if(i == selectID) {
			cameras[i].enabled = true;
		} else {
			cameras[i].enabled = false;
		}
	}
}