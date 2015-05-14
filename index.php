<!DOCTYPE HTML>
<html lang="en">
<head>
    <link rel="icon" href="./pics/favicon.ico" >
    <title>Rush To Flush-Main</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="style/style.css" type="text/css" />
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="http://repo.zebkit.org/latest/zebra.min.js" type="text/javascript"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <style>
        .jumbotron {
            background: #FFFFD4;
        }
        #canGame {
          background: #FFFFFF;
        }
    </style>
</head>
<body onload="pageLoaded()">
    <div class="jumbotron text-center">
        <h1>Rush To Flush</h1>
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
   <?php
        $conn = mysqli_connect('mysql.hostinger.kr', 'u599020273_flush', 'team404', 'u599020273_flush');
        if(mysqli_connect_errno($conn)){
            echo "fail to connect DB: " . mysqli_connect_error();
        }


           echo "<h2> [score order]</h2>";
           $sql = "SELECT name, score, level FROM Boards ORDER BY score DESC";
           echo "<table width='100%'><thead><td width='40%'><h3>NAME</h3></td>";
           echo "<th width='35%'><h3>SCORE</h3></td>";
           echo "<td width='25%'><h3>LV</h3></td></thead>";
      
           $result = $conn->query($sql);
            if($result->num_rows >0){
                $count = 0;
                while(($row = $result->fetch_assoc())&& $count<10){
                    echo "<tr><td>".$row['name']."</td>";
                    echo "<td>".$row['score']."</td>";
                    echo "<td>".$row['level']."</td></tr>";
                    $count++;
                }
            } else
               echo "0 results";

             echo "</table>";

            echo "<br><h2> [level order]</h2>";
            $sql = "SELECT name, score, level FROM Boards ORDER BY level DESC";
            echo "<table width='100%'><thead><td width='40%'><h3>NAME</h3></td>";
            echo "<td width='35%'><h3>SCORE</h3></td>";
            echo "<td width='25%'><h3>LV</h3></td></thead>";


  
            $result = $conn->query($sql);
            if($result->num_rows > 0){
                $count = 0;
                while(($row = $result->fetch_assoc()) && $count <10){
                    echo "<tr><td>".$row['name']."</td>";
                    echo "<td>".$row['score']."</td>";
                    echo "<td>".$row['level']."</td></tr>";
                    $count++;
                }
            } else
               echo "0 results";

            echo "</table>";
  


        $conn->close();
    ?>
  </div>
  <div class="col-md-4"></div>
</div>
</body>
</html>