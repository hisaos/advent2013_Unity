#pragma strict
var ballPrefab:GameObject;
var ballMaxVel = 7f;
var ballMinVel = 3f;
var ballMaxWind = 1f;
var ballMinWind = -1f;

function Start () {

}

function Update () {

}

function ThrowBall () {
	var ballInstance:GameObject = Instantiate(ballPrefab);
	ballInstance.gameObject.transform.position = new Vector3(0f, 0.3f, 0f);
	ballInstance.gameObject.GetComponent.<Rigidbody>().velocity = new Vector3(Random.Range(ballMinWind, ballMaxWind), 0f, -Random.Range(ballMinVel, ballMaxVel));
}