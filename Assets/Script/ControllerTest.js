#pragma strict
var speed:float = 5f;

function Start () {

}

function Update () {
	var xAxisValue = Input.GetAxis("Horizontal");
	var yAxisValue = Input.GetAxis("Vertical");
	
	transform.Translate(Vector3.right * xAxisValue * speed * Time.deltaTime);
	transform.Translate(Vector3.forward * yAxisValue * speed * Time.deltaTime);

	if(Input.GetButtonDown("Fire1"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire1");
	}
	else if(Input.GetButtonDown("Fire2"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire2");
	}
	else if(Input.GetButtonDown("Fire3"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire3");
	}
	else if(Input.GetButtonDown("Fire4"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire4");
	}
	else if(Input.GetButtonDown("Fire5"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire5");
	}
	else if(Input.GetButtonDown("Fire6"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire6");
	}
	else if(Input.GetButtonDown("Fire7"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire7");
	}
	else if(Input.GetButtonDown("Fire8"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire8");
	}
	else if(Input.GetButtonDown("Fire9"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire9");
	}
	else if(Input.GetButtonDown("Fire10"))
	{
		GetComponent.<Rigidbody>().AddForce(Vector3.up * speed, ForceMode.VelocityChange);
		Debug.Log("fire10");
	}
}