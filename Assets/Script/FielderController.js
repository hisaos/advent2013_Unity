#pragma strict
var ballFallPoint:Vector3;
var destinationPoint:Vector3;
var speed:float = 2f;
var positionNumber:int;
var baseStaying:GameObject;
var havingBall:boolean;
enum PositionName {P=1, C, FB, SB, TB, SS, LF, CF, RF};

function Start () {
	havingBall = false;
}

function Update () {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	SetBallFallPoint(sc.TellBouncePoint());
	var state:int = sc.TellState();

	SetBaseStaying();

	if (havingBall) {
		GetRunnerOut();
		ThrowBall();
	}
	
	if (state > 2) {
		SetDestinationPointAfterBounce();
	} else {
		SetDestinationPoint();
	}
		
	if (state > 1) {
		var relativePos = destinationPoint - transform.position;
		transform.rotation = Quaternion.LookRotation(new Vector3(relativePos.x, 0, relativePos.z));
		transform.position += transform.forward * speed * Time.deltaTime;
	}
}

function ThrowBall () {
	var ball:GameObject = this.gameObject.FindGameObjectWithTag("Ball");
	var sc:SequenceController = this.gameObject.Find("GameMaster").GetComponent("SequenceController");
	
	var targetPosition:Vector3 = sc.TellBaseToGo().transform.position;

	var direction:Vector3 = Vector3.Normalize(targetPosition - this.gameObject.transform.position);
	ball.transform.position = new Vector3(this.gameObject.transform.position.x, 1f, this.gameObject.transform.position.z);
	ball.GetComponent.<Rigidbody>().velocity = new Vector3(direction.x * 10f, 0, direction.z * 10f);
	
	SetHavingBall(false);
}

function GetRunnerOut() {
	if(baseStaying.Equals(gameObject.Find("GameMaster"))) {
		return;
	}
	var runners:GameObject[] = gameObject.FindGameObjectsWithTag("Runner");
	
	for (var i = 0; i < runners.Length; i++) {
		var rc:BatterController = runners[i].gameObject.GetComponent("BatterController");
		var base:GameObject = rc.TellTargetBase();
		rc.NotifyGetOut(baseStaying);
	}
}

function SetBaseStaying () {
	var bases:GameObject[] = gameObject.FindGameObjectsWithTag("Base");
	
	baseStaying = gameObject.Find("GameMaster");
	
	for(var i = 0; i < bases.Length; i++) {
		if(Vector3.Distance(transform.position, bases[i].transform.position) < 0.5f) {
			baseStaying = bases[i];
			break;
		}
	}
}

function SetPosition (pos : int) {
	positionNumber = pos;
}

function SetBallFallPoint (position : Vector3) {
	ballFallPoint = position;
}

function SetHavingBall (having : boolean) {
	havingBall = having;
}

function TellBaseStaying () : GameObject {
	return baseStaying;
}

function TellHavingBall () : boolean {
	return havingBall;
}

function SetDestinationPointAfterBounce () {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	var ball:GameObject = gameObject.FindGameObjectWithTag("Ball");
	var angle = sc.TellAngle();
	var base1 = gameObject.Find("Field/Base1").transform.position;
	var base2 = gameObject.Find("Field/Base2").transform.position;
	var base3 = gameObject.Find("Field/Base3").transform.position;
	var base4 = gameObject.Find("Field/Base4").transform.position;

	if(positionNumber == PositionName.FB) {
		if (angle == 0) destinationPoint = ball.transform.position;
		else destinationPoint = base1;
	} else if (positionNumber == PositionName.SB) {
		if (angle == 0) destinationPoint = base1;
		else if (angle == 1) destinationPoint = ball.transform.position;
		else destinationPoint = base2;
	} else if (positionNumber == PositionName.SS) {
		if (angle == 0 || angle == 1) destinationPoint = base2;
		else if (angle == 2) destinationPoint = ball.transform.position;
		else destinationPoint = base3;
	} else if (positionNumber == PositionName.TB) {
		if (angle == 3) destinationPoint = ball.transform.position;
		else destinationPoint = base3;
	} else if (positionNumber == PositionName.C) {
		destinationPoint = base4;
	} else {
		destinationPoint = ball.transform.position;
	}
}

function SetDestinationPoint () {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	var angle = sc.TellAngle();
	var base1 = gameObject.Find("Field/Base1").transform.position;
	var base2 = gameObject.Find("Field/Base2").transform.position;
	var base3 = gameObject.Find("Field/Base3").transform.position;
	var base4 = gameObject.Find("Field/Base4").transform.position;

	if(positionNumber == PositionName.FB) {
		if (angle == 0) destinationPoint = ballFallPoint;
		else destinationPoint = base1;
	} else if (positionNumber == PositionName.SB) {
		if (angle == 0) destinationPoint = base1;
		else if (angle == 1) destinationPoint = ballFallPoint;
		else destinationPoint = base2;
	} else if (positionNumber == PositionName.SS) {
		if (angle == 0 || angle == 1) destinationPoint = base2;
		else if (angle == 2) destinationPoint = ballFallPoint;
		else destinationPoint = base3;
	} else if (positionNumber == PositionName.TB) {
		if (angle == 3) destinationPoint = ballFallPoint;
		else destinationPoint = base3;
	} else if (positionNumber == PositionName.C) {
		destinationPoint = base4;
	} else {
		destinationPoint = ballFallPoint;
	}
}