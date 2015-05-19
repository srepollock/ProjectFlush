<!DOCTYPE HTML>
<html lang="en">
<head>
    <title>Rush To Flush-LeaderBoards</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style/style.css" type="text/css" />
    <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
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

<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4 text-center" id="score">
    <h2>LeaderBoards</h2>
    

<?php
    $conn = mysqli_connect('mysql.hostinger.kr', 'u599020273_flush', 'team404', 'u599020273_flush');
    if(mysqli_connect_errno($conn)){
        echo "fail to connect DB: " . mysqli_connect_error();
    }

    if(isset($_POST['name'])){
        echo "isset working";
        $name = $_POST['name'];
        $score = $_POST['score'];
        $level = $_POST['level'];

        $query = "INSERT INTO Score(name, score, level) VALUES('$name','$score','$level')";
       $conn->query($query);

    }else

       echo "<h2> [score order]</h2>";
       $sql = "SELECT name, score, level FROM Score ORDER BY score DESC";
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
        $sql = "SELECT name, score, level FROM Score ORDER BY level DESC, score DESC";
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

