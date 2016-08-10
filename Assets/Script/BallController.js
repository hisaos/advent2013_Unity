#pragma strict
var powerMax:float = 10f;
var powerR:float = 3f;
var powerT:float = 5f;
var velToStopped:float = 0.1f;

var rootPoint:float = 0.15f;
var tipPoint:float = 0.25f;

var bouncePoint:Vector3;
var gm:SequenceController;

function Start () {
	gm = gameObject.Find("GameMaster").GetComponent("SequenceController");
}

function Update () {
	var state:int = gm.TellState();
		
	if(state == 3 && this.GetComponent.<Rigidbody>().velocity.magnitude < velToStopped) {
		StopBall();
	}
}

function OnCollisionEnter (other : Collision) {
	if(other.gameObject.tag == "Bat") {
		Debug.Log("bat!");
		other.gameObject.layer = 9; // BackGround
		var batter:GameObject = gameObject.FindGameObjectWithTag("Batter");
		
		gm.GetRunnersRunning();
		
		var bc:BatterController = batter.gameObject.GetComponent("BatterController");
		bc.StartRunning();
		
		gm.SetTimeToThrow(3f);
		gm.NotifyBallFlying();

		// bat hit the ball
		// calculate its flight
		var angle:float = other.gameObject.FindGameObjectWithTag("Bat").transform.eulerAngles.y - 90f;
		
		// tell GM the angle
		if (angle > -90f && angle < -15f) {
			gm.SetAngle(3); // THIRD
		} else if (angle >= -15f && angle < 0f) {
			gm.SetAngle(2); // SHORT
		} else if (angle >= 0f && angle < 15f) {
			gm.SetAngle(1); // SECOND
		} else {
			gm.SetAngle(0); // FIRST
		}

		var cpoint : ContactPoint = other.contacts[0];
		var ca = CalcAngle(cpoint);
		var cp = CalcPower(cpoint);
		
		// calc velocity of hitball
		var hitBallVelX = cp * Mathf.Sin(angle * Mathf.PI / 180f);
		var hitBallVelY = cp * Mathf.Sin(ca * Mathf.PI / 180f);
		var hitBallVelZ = cp * Mathf.Cos(ca * Mathf.PI / 180f);

		var initVel = new Vector3(hitBallVelX, hitBallVelY, hitBallVelZ);
		var initPos = this.gameObject.transform.position;
		
		UpdatePredictionLine(initPos, initVel);

		// give vel to ball
		this.GetComponent.<Rigidbody>().velocity = initVel;
		
		this.GetComponent.<Rigidbody>().useGravity = true;
	} else if (other.gameObject.tag == "Floor") {
		gm.NotifyBallBounced();
		batter = gameObject.FindGameObjectWithTag("Batter");
		if (batter) batter.gameObject.tag = "Runner";
	} else if(other.gameObject.tag == "Fielder") {
		var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
		if(sc.TellState() < 3) {
			Destroy(gameObject.FindGameObjectWithTag("Batter"));
			var hc:HUDController = gameObject.Find("GameMaster").GetComponent("HUDController");
			hc.AddOut();
		}
		
		sc.NotifyBallCaught();
		
		var fc:FielderController = other.gameObject.transform.parent.GetComponent("FielderController");
		fc.SetHavingBall(true);
	}
}

function TellBouncePointToGameMaster (bouncePoint : Vector3) {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	sc.SetBouncePoint(bouncePoint);
}

function CalcPower (cp : ContactPoint) : float {
	var R:GameObject = GameObject.Find("Paddle/Root");
	var contactPower:float;

	var x = Vector3.Distance(R.gameObject.transform.position, cp.point);
	if(x < 0.2f) { // before S
		contactPower = ((powerMax - powerR) / 12.5f) * (x * 100f - 7.5f) + powerR;
	} else { // after Tmin
		contactPower = ((powerT - powerMax) / 12.5f) * (x * 100f - 20f) + powerMax;
	}

	if(contactPower < 0f) contactPower = 0f;
	
	return contactPower;
}

function CalcAngle (cp : ContactPoint) : float {
	var R:GameObject = GameObject.Find("Paddle/Root");
	var contactAngle:float;
	
	var x = Vector3.Distance(R.gameObject.transform.position, cp.point);
	if(x < rootPoint) { // before Rmax
		contactAngle = (7f / 3f) * (x * 100f);
	} else if (rootPoint <= x && x < tipPoint) { // btwn. Smin and Smax
		contactAngle = 2f * (x - rootPoint) * 100f + 35f;
	} else { // after Tmin
		contactAngle = (14f / 3f) * (x - tipPoint) * 100f + 55f;
	}

	return contactAngle;
}

// derived from http://morgan-davidson.com/2012/06/19/3d-projectile-trajectory-prediction/
function UpdatePredictionLine(startingPosition : Vector3, initialVelocity : Vector3) : Vector3 {
	var hitPoint:Vector3 = new Vector3();
	var previousPosition:Vector3 = startingPosition;
	//var predictionLine:LineRenderer = gameObject.Find("LineRendererHolder").GetComponent(LineRenderer);
	
	//predictionLine.SetVertexCount(180);
	//predictionLine.SetWidth(0.1, 0.1);
	//predictionLine.SetColors(Color.red, Color.yellow);

	for(var i = 0; i < 180; i++) {
		var posN:Vector3 = GetTrajectoryPoint(startingPosition, initialVelocity, i, Physics.gravity);
		var direction:Vector3 = posN - previousPosition;
		//predictionLine.SetPosition(i, posN);
		
		direction.Normalize();
		
		var distance:float = Vector3.Distance(posN, previousPosition);
		
		var hitInfo:RaycastHit = new RaycastHit();
		if(Physics.Raycast(previousPosition, direction, hitInfo, distance)) {
			hitPoint = hitInfo.point;
			TellBouncePointToGameMaster(hitPoint);
			break;
		}
		
		previousPosition = posN;
	}
	
	return hitPoint;
}

function GetTrajectoryPoint (startingPosition : Vector3, initialVelocity : Vector3, timeStep : float, gravity : Vector3) : Vector3 {
	var physicsTimeStep:float = Time.fixedDeltaTime;
	var stepVelocity:Vector3 = physicsTimeStep * initialVelocity;
	var stepGravity:Vector3 = physicsTimeStep * physicsTimeStep * gravity;
	
	return startingPosition + (timeStep * stepVelocity) + ( ( (timeStep + timeStep * timeStep) * stepGravity) / 2.0f);
}

function StopBall () {
	gm.NotifyBallStopped();
}

function OnBecameInvisible () {
	if (gm.TellState() == 2 || gm.TellState() == 3) StopBall();
}