<!DOCTYPE HTML>
<html lang="en">
<head>
    <title>Rush To Flush-LeaderBoards</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style/style.css" type="text/css" />
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<style>
      .jumbotron {
            background: #FFFFD4;
        }
    </style>
</head>
<body>
<div class="jumbotron">
<h1>Rush To Flush</h1>
</div>
<div class="row">
	<div class="col-md-12 text-center"><a class="btn btn-info" href="index.php">Home</a></div>
</div>
<br />
<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4 text-center" id="score">
    <h2>Leaderboard</h2>
	<?php
    $conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
    if(mysqli_connect_errno($conn)){
        echo "fail to connect DB: " . mysqli_connect_error();
    }

    if(isset($_POST['name'])){
        echo "isset working";
        $name = $_POST['name'];
        $score = $_POST['score'];
        $level = $_POST['level'];
		date_default_timezone_set('America/Vancouver');
		$curdate = date("Y-m-d");
		
        $query = "INSERT INTO Score(name, score, level,date) VALUES('$name','$score','$level','$curdate')";
       $conn->query($query);
	}
	$conn->close();
	?>
		<ul class="nav nav-tabs">
		  <li class="active"><a data-toggle="tab" href="#d_score">Daily Score</a></li>
		  <li><a data-toggle="tab" href="#d_lv">Daily Level</a></li>
		  <li><a data-toggle="tab" href="#t_score">Total Score</a></li>
		  <li><a data-toggle="tab" href="#t_lv">Total Level</a></li>
		</ul>

		<div class="tab-content">
			<div id="d_score" class="tab-pane fade in active">
			<h2>Daily Score Rank</h2>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					date_default_timezone_set('America/Vancouver');
					$curdate = date("Y-m-d");
					$sql = "SELECT name, score FROM Score WHERE date >='$curdate' ORDER BY score DESC, level DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='10%'></td>";
						echo "<td width='60%'>NAME</td>";
						echo "<td width='30%'>Score</td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							$count++;
							echo "<tr><td width='10%'>".$count."</td>";
							echo "<td width='60%'>".$row['name']."</td>";
							echo "<td width='30%'>".$row['score']."</td></tr>";
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="d_lv" class="tab-pane fade">
			<h2>Daily Level Rank</h2>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					date_default_timezone_set('America/Vancouver');
					$curdate = date("Y-m-d");
					$sql = "SELECT name, level FROM Score WHERE date >='$curdate' ORDER BY level DESC, score DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='10%'></td>";
						echo "<td width='60%'>NAME</td>";
						echo "<td width='30%'>LV</td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							$count++;
							echo "<tr><td width='10%'>".$count."</td>";
							echo "<td width='60%'>".$row['name']."</td>";
							echo "<td width='30%'>".$row['level']."</td></tr>";
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="t_score" class="tab-pane fade">
			<h2>Total Score Rank</h2>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					$sql = "SELECT name, score FROM Score ORDER BY score DESC, level DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='10%'></td>";
						echo "<td width='60%'>NAME</td>";
						echo "<td width='30%'>Score</td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							$count++;
							echo "<tr><td width='10%'>".$count."</td>";
							echo "<td width='60%'>".$row['name']."</td>";
							echo "<td width='30%'>".$row['score']."</td></tr>";
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="t_lv" class="tab-pane fade">
			<h2>Total Level Rank</h2>
			<?php
			$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
			if(mysqli_connect_errno($conn)){
				echo "fail to connect DB: " . mysqli_connect_error();
			}
			else{
				$sql = "SELECT name, level FROM Score ORDER BY level DESC, score DESC";

				$result = $conn->query($sql);
				if($result->num_rows > 0){	
					echo "<table width='100%'><thead><td width='10%'></td>";
						echo "<td width='60%'>NAME</td>";
						echo "<td width='30%'>LV</td></thead>";
					$count = 0;
					while(($row = $result->fetch_assoc()) && $count <10){
						$count++;
						echo "<tr><td width='10%'>".$count."</td>";
						echo "<td width='60%'>".$row['name']."</td>";
						echo "<td width='30%'>".$row['level']."</td></tr>";
					}
				} else
				   echo "NOTHING ON THE BOARD";

				echo "</table>";
			}
			$conn->close();
		?>
		</div>
		</div>
	</div>

  </div>
  <div class="col-md-4"></div>
</div>
</body>
</html>

