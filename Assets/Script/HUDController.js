#pragma strict
var distanceRaw:float;
var distanceSimple2D:float;
var distanceProjected2D:float;
var score:int;
var outCount:int;

function Start () {
	distanceRaw = 0f;
	distanceSimple2D = 0f;
	distanceProjected2D = 0f;
	score = 0;
	outCount = 0;
}

function Update () {

}

function SetHUDDistance (dRaw : float, dSim2D : float, dProj2D : float) {
	distanceRaw = dRaw;
	distanceSimple2D = dSim2D;
	distanceProjected2D = dProj2D;
}

function AddScore () {
	score++;
}

function AddOut () {
	outCount++;
}

function TellGameOver () {
	if (outCount >= 3) return true;
	else return false;
}

function OnGUI () {
//    GUILayout.Label("DistanceRaw:" + distanceRaw);
//    GUILayout.Label("DistanceSimple2D:" + distanceSimple2D);
//    GUILayout.Label("DistanceProjected2D:" + distanceProjected2D);
    GUILayout.Label("Score:" + score);
    GUILayout.Label("Out:" + outCount);
    if(outCount >= 3) {
		if(GUILayout.Button("Replay")) {
			score = 0;
			outCount = 0;
			var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
			sc.InitiateField();
		}
	}
}