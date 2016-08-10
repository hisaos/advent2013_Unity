#pragma strict
var isRunning:boolean = false;
var speed:float = 5f;
var baseToGo:GameObject;
var baseStaying:GameObject;
var lineStaying:int;

// enum STATUS {BEFORE_THROW, AFTER_THROW, BALL_FLYING, BALL_BOUNCED, BALL_STOPPED, BALL_CAUGHT, RUNNER_OUT};

function Start () {
	baseToGo = gameObject.Find("Field/Base1");
	lineStaying = 0;
	TellTargetBaseToGameMaster();
	isRunning = false;
}

function Update () {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	
	if(isRunning) {
		SetTargetBase();
		TellTargetBaseToGameMaster();
		
		var relativePos:Vector3 = baseToGo.gameObject.transform.position - this.gameObject.transform.position;
		transform.rotation = Quaternion.LookRotation(new Vector3(relativePos.x, 0, relativePos.z));
		transform.position += transform.forward * speed * Time.deltaTime;
		
		var ball:GameObject = gameObject.FindGameObjectWithTag("Ball");
		var bc:BallController = ball.GetComponent("BallController");
	}
	
	if(Input.GetKey(KeyCode.M) || Input.GetButtonDown("Fire4")) {
		if(sc.TellState() >= 2) {
			StartRunning();
		}
	}
	if(Input.GetKey(KeyCode.N) || Input.GetButtonDown("Fire3")) {
		if(sc.TellState() >= 2) {
			StartRunning();
			if(lineStaying == 0) {
			} else if(lineStaying == 1) {
				baseToGo = gameObject.Find("Field/Base1");				
			} else if(lineStaying == 2) {
				baseToGo = gameObject.Find("Field/Base2");				
			} else if(lineStaying == 3) {
				baseToGo = gameObject.Find("Field/Base3");				
			} 
		}
	}
}

function SetTargetBase () : GameObject {
	var distanceToTargetBase:float = Vector3.Distance(baseToGo.transform.position, this.gameObject.transform.position);
	
	if(distanceToTargetBase < 0.5f) {
		baseStaying = baseToGo;
		if(baseStaying.Equals(gameObject.Find("Field/Base1"))) {
			baseToGo = gameObject.Find("Field/Base2");
			lineStaying = 1;
		} else if(baseStaying.Equals(gameObject.Find("Field/Base2"))) {
			baseToGo = gameObject.Find("Field/Base3");
			lineStaying = 2;
		} else if(baseStaying.Equals(gameObject.Find("Field/Base3"))) {
			baseToGo = gameObject.Find("Field/Base4");
			lineStaying = 3;
		} else if(baseStaying.Equals(gameObject.Find("Field/Base4"))) {
			var hc:HUDController = gameObject.Find("GameMaster").GetComponent("HUDController");
			hc.AddScore();
			Destroy(this.gameObject);
		}
		TellTargetBaseToGameMaster();
		isRunning = false;
	}
}

function TellTargetBase () : GameObject {
	return baseToGo;
}

function TellTargetBaseToGameMaster () {
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	sc.NotifyBaseToGo(baseToGo);
}

function StartRunning () {
	isRunning = true;
	baseStaying = gameObject.Find("GameMaster");	// nowhere on field
}

function NotifyGetOut (baseFielderStaying : GameObject) {
	if (!baseStaying.Equals(gameObject.Find("GameMaster"))) return;
	
	var sc:SequenceController = gameObject.Find("GameMaster").GetComponent("SequenceController");
	
	if (baseFielderStaying.Equals(baseToGo)) {
		sc.NotifyRunnerOut();
		Destroy(this.gameObject);
		var hc:HUDController = gameObject.Find("GameMaster").GetComponent("HUDController");
		hc.AddOut();
	}
}