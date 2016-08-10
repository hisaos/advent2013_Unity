#pragma strict
var rotateAccel = 1f;
var rotateVelocity = 0f;
var rotateVelocityLimit = 15f;
var rotationAngle = 0f;
var rotationAngleLimit = 225f;
var speed = 5f;
var isRotating = true;

function Start () {
	isRotating = true;
}

function Update () {
	this.gameObject.GetComponent.<Rigidbody>().velocity = new Vector3(0f, 0f, 0f);

	var xAxisValue = Input.GetAxis("Horizontal");
	var yAxisValue = Input.GetAxis("Vertical");

//	Debug.Log("x:"+xAxisValue);
//	Debug.Log("y:"+yAxisValue);

	transform.Translate(Vector3.right * (-1f) * xAxisValue * speed * Time.deltaTime);
	transform.Translate(Vector3.forward * (-1f) * yAxisValue * speed * Time.deltaTime);	

	/*
	if(Input.GetKey(KeyCode.W)) {
		this.gameObject.transform.position += new Vector3(0f, 0f, 1f) * Time.deltaTime;
	}
	else if(Input.GetKey(KeyCode.A)) {
		this.gameObject.transform.position += new Vector3(-1f, 0f, 0f) * Time.deltaTime;
	}
	else if(Input.GetKey(KeyCode.S)) {
		this.gameObject.transform.position += new Vector3(0f, 0f, -1f) * Time.deltaTime;
	}
	else if(Input.GetKey(KeyCode.D)) {
		this.gameObject.transform.position += new Vector3(1f, 0f, 0f) * Time.deltaTime;
	}
	*/

	if(isRotating) {
	if(Input.GetMouseButton(0) || Input.GetButton("Fire4")) {
		if(rotateVelocity < rotateVelocityLimit) rotateVelocity += rotateAccel;
		if(rotationAngle < rotationAngleLimit) rotationAngle += rotateVelocity;

//		this.gameObject.transform.Rotate(0, -1f * rotateVel, 0);
		this.gameObject.transform.rotation = Quaternion.Euler(0, 180 - rotationAngle, 0);
	}
	else {
		rotateVelocity = 0f;
		rotationAngle = 0f;
		this.gameObject.transform.rotation = Quaternion.Euler(0, 180 - rotationAngle, 0);
	}
	}
}

function stopRotate () {
	isRotating = false;
}