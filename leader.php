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
<center><a class="btn btn-primary" href="index.html">Home</a></center>
<br />
<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4 text-center" id="score">
    <h2>LeaderBoards</h2>
    

<?php
    $conn = mysqli_connect('mysql.hostinger.kr', 'u599020273_flush', 'team404', 'u599020273_flush');
    if(mysqli_connect_errno($conn)){
        echo "fail to connect DB: " . mysqli_connect_error();
    }

    if(!empty($_GET['name'])){
        $name = $_GET['name'];
        $score = $_GET['score'];
        $level = $_GET['level'];

        $query = "INSERT INTO Boards(name, score, level) VALUES('$name','$score','$level')";
        $result = $conn->query($query);
        if($result){
            //echo $conn->affected_rows. " are inserted";
        }
    }else
        //echo "nothing get";

       echo "<br><br><h2> score order</h2><br>";
       $sql = "SELECT name, score, level FROM Boards ORDER BY score DESC";
       echo "<table width='300'><tr><td width='33%'><h3>name</h3></td>";
       echo "<td width='33%'><h3>score</h3></td>";
       echo "<td width='33%'><h3>level</h3></td></tr>";
      
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

        echo "<br><br><br><h2> level order</h2><br>";
        $sql = "SELECT name, score, level FROM Boards ORDER BY level DESC";
        echo "<table width='300'><tr><td width='33%'><h3>name</h3></td>";
        echo "<td width='33%'><h3>score</h3></td>";
        echo "<td width='33%'><h3>level</h3></td></tr>";


  
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

