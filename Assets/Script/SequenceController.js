#pragma strict
var state:int;
var angle:int;
var timeToThrow:float;
var bouncePoint:Vector3;
var fielders:GameObject[];
//var runners:List.<GameObject>;
var batter:GameObject;
var bat:GameObject;
var baseToGo:GameObject;

enum STATUS {BEFORE_THROW, AFTER_THROW, BALL_FLYING, BALL_BOUNCED, BALL_STOPPED, BALL_CAUGHT, RUNNER_OUT};
enum ANGLE {FIRST, SECOND, SHORT, THIRD};

function Start () {
	InitiateField();
//	runners = new List.<GameObject>();
}

function Update () {
	if(state == STATUS.BEFORE_THROW) {
		var bl:BallLauncher = gameObject.Find("BallLauncher").GetComponent("BallLauncher");
		bl.ThrowBall();
		SetTimeToThrow(3f);
		ChangeState(STATUS.AFTER_THROW);
	} else if(state == STATUS.AFTER_THROW) {
		CountDownToInitiate();
	} else if(state == STATUS.BALL_FLYING) {
		var zeroPoint = gameObject.Find("Field/Base4").gameObject.transform.position;
		var hc:HUDController = gameObject.Find("GameMaster").GetComponent("HUDController");
		hc.SetHUDDistance(CalculateFlyingDistanceRaw(zeroPoint), CalculateFlyingDistanceSimple2D(zeroPoint), CalculateFlyingDistanceProjected2D(zeroPoint));
	} else if(state == STATUS.BALL_BOUNCED) {
		
	} else if(state == STATUS.BALL_STOPPED) {
		CountDownToInitiate();
	} else if(state == STATUS.BALL_CAUGHT) {
		CountDownToInitiate();
	} else if(state == STATUS.RUNNER_OUT) {
		CountDownToInitiate();
	}
}

function CountDownToInitiate () {
	var hc:HUDController = gameObject.Find("GameMaster").GetComponent("HUDController");
	if(hc.TellGameOver()) return;

	timeToThrow -= Time.deltaTime;
	if(timeToThrow < 0f) {
		InitiateField();
	}
}

function InitiateField () {
	ChangeState(STATUS.BEFORE_THROW);
	timeToThrow = 3f;
	
	Destroy(gameObject.FindGameObjectWithTag("Batter"));
	Destroy(GameObject.FindGameObjectWithTag("Bat"));
	
	var fieldersOnField:GameObject[] = gameObject.FindGameObjectsWithTag("Fielder");
	for(var i = 0; i < fieldersOnField.Length; i++) {
		Destroy(fieldersOnField[i]);
	}

	Instantiate(batter);
	Instantiate(bat);
	bat.layer = 0;	// Default

	for(var j = 0; j < fielders.Length; j++) {
		Instantiate(fielders[j]);
	}

	var balls:GameObject[] = gameObject.FindGameObjectsWithTag("Ball");
	for(var m = 0; m < balls.Length; m++) {
		Destroy(balls[m]);
	}
}

function CalculateFlyingDistanceRaw (zeroPoint : Vector3) : float {
	return Vector3.Distance(zeroPoint, this.gameObject.transform.position);
}

function CalculateFlyingDistanceSimple2D (zeroPoint : Vector3) : float {
	var zeroPoint2D = new Vector2(zeroPoint.x, zeroPoint.z);
	return Vector2.Distance(zeroPoint2D, new Vector2(this.gameObject.transform.position.x, this.gameObject.transform.position.z));
}

function CalculateFlyingDistanceProjected2D (zeroPoint : Vector3) : float {
	var hitPoint:Vector3 = new Vector3();
	var distance:float = float.MaxValue;
	var direction:Vector3 = Vector3.down;
	var ballPosition:Vector3 = this.gameObject.transform.position;
		
	var hitInfo:RaycastHit = new RaycastHit();
	if(Physics.Raycast(ballPosition, direction, hitInfo, distance)) {
		hitPoint = hitInfo.point;
	}

	return Vector3.Distance(zeroPoint, hitPoint);
}

function TellState () : int {
	return state;
}

function TellBouncePoint () : Vector3 {
	return bouncePoint;
}

function TellBallIsHit () : boolean {
    return (state == STATUS.BALL_FLYING || state == STATUS.BALL_STOPPED);
}

function TellAngle () : float {
	return angle;
}

function TellBaseToGo () : GameObject {
	return baseToGo;
}

function NotifyBallFlying () {
	state = STATUS.BALL_FLYING;
}

function NotifyBallBounced () {
	if (state != STATUS.RUNNER_OUT) {
		state = STATUS.BALL_BOUNCED;
		timeToThrow = 3f;
	}
}

function NotifyBallStopped () {
	if (state != STATUS.RUNNER_OUT) {
		state = STATUS.BALL_STOPPED;
		timeToThrow = 3f;
	}
}

function NotifyBallCaught () {
	if (state != STATUS.RUNNER_OUT) {
		state = STATUS.BALL_CAUGHT;
		timeToThrow = 3f;
	}
}

function NotifyRunnerOut () {
	state = STATUS.RUNNER_OUT;
}

function GetRunnersRunning () {
	var runners:GameObject[] = gameObject.FindGameObjectsWithTag("Runner");

	for(var i = 0; i < runners.Length; i++) {
		var rc:BatterController = runners[i].gameObject.GetComponent("BatterController");
		rc.StartRunning();
	}
}

function NotifyBaseToGo (base : GameObject) {
	baseToGo = base;
}

function SetBouncePoint (bp : Vector3) {
	bouncePoint = bp;
}

function SetTimeToThrow (timeToSet : float) {
	timeToThrow = timeToSet;
}

function SetAngle (ang : int) {
	angle = ang;
}

function ChangeState (stateToChange : int) {
	state = stateToChange;
}