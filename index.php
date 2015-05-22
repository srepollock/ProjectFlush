<?
  session_start();
  $_SESSION['seshNo']="ProjectFlush";
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <link rel="icon" href="./pics/favicon.ico" >
    <title>Rush To Flush-Main</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="style/style.css" type="text/css" />
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<style>
        #top {
            background: #FFFFD4;
        }
        #canGame {
          background: #FFFFFF;
        }
    </style>
</head>
<body onload="pageLoaded()">
	<div "row">
	    <div class="col-lg-12 text-center" id="top">
	        <h1>Rush To Flush</h1>
	    </div>
	</div>
    <center>
      <canvas id="canGame" width="310px" height="400px"></canvas>
      <script src="./script/game.js" type="text/javascript"></script>
    </center>
<div class="row">
  <div class="col-md-4"></div>
    <div class="col-md-4" id="about">
      <h2 id="team">About The Team</h2>
      <img src="pics/404groupnotfound.jpg" alt="404 Group Not Found Picture" width="70%" />
      <p>COMP 2910</p>  
      <p>Developers: Aicha, Eunwon, Hai, Robert &amp; Spencer</p>
  </div>
  <div class="col-md-4"></div>
</div>
<br />
<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4 text-center" id="score">
    <h2>Leaderboard</h2>
		<ul class="nav nav-tabs">
		  <li class="active"><a data-toggle="tab" href="#d_score">Daily Score</a></li>
		  <li><a data-toggle="tab" href="#d_lv">Daily Level</a></li>
		  <li><a data-toggle="tab" href="#t_score">Total Score</a></li>
		  <li><a data-toggle="tab" href="#t_lv">Total Level</a></li>
		</ul>

		<div class="tab-content">
			<div id="d_score" class="tab-pane fade in active">
			<h3>Daily Score Rank</h3>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					//echo "<br><h2> [Today Score Rank]</h2>";
					$sql = "SELECT name, score FROM Score WHERE date >=CURDATE() ORDER BY score DESC, level DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='65%'>NAME</td>";
						echo "<td width='35%'><h3>LV</h3></td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							echo "<tr><td width='65%'>".$row['name']."</td>";
							echo "<td width='35%'>".$row['score']."</td></tr>";
							$count++;
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="d_lv" class="tab-pane fade">
			<h3>Daily Level Rank</h3>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					$sql = "SELECT name, level FROM Score WHERE date >=CURDATE() ORDER BY level DESC, score DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='65%'>NAME</td>";
						echo "<td width='35%'><h3>LV</h3></td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							echo "<tr><td width='65%'>".$row['name']."</td>";
							echo "<td width='35%'>".$row['level']."</td></tr>";
							$count++;
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="t_score" class="tab-pane fade">
			<h3>Total Score Rank</h3>
			<?php
				$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
				if(mysqli_connect_errno($conn)){
					echo "fail to connect DB: " . mysqli_connect_error();
				}
				else{
					$sql = "SELECT name, level FROM Score  ORDER BY level DESC, score DESC";

					$result = $conn->query($sql);
					if($result->num_rows > 0){	
						echo "<table width='100%'><thead><td width='65%'>NAME</td>";
						echo "<td width='35%'>LV</td></thead>";
						$count = 0;
						while(($row = $result->fetch_assoc()) && $count <10){
							echo "<tr><td width='65%'>".$row['name']."</td>";
							echo "<td width='35%'>".$row['level']."</td></tr>";
							$count++;
						}
					} else
					   echo "NOTHING ON THE BOARD";

					echo "</table>";
				}
				$conn->close();
			?>
		</div>
		<div id="t_lv" class="tab-pane fade">
			<h3>Total Level Rank</h3>
			<?php
			$conn = mysqli_connect('mysql.hostinger.kr', 'u544216313_user', 'werbest404', 'u544216313_db');
			if(mysqli_connect_errno($conn)){
				echo "fail to connect DB: " . mysqli_connect_error();
			}
			else{
				$sql = "SELECT name, score FROM Score ORDER BY score DESC, level DESC";

				$result = $conn->query($sql);
				if($result->num_rows > 0){	
					echo "<table width='100%'><thead><td width='65%'>NAME</td>";
					echo "<td width='35%'><h3>LV</h3></td></thead>";
					$count = 0;
					while(($row = $result->fetch_assoc()) && $count <10){
						echo "<tr><td width='65%'>".$row['name']."</td>";
						echo "<td width='35%'>".$row['score']."</td></tr>";
						$count++;
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
  <div class="col-md-4"></div>
</div>
</body>
</html>