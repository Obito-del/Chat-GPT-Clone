// 1. Sort the array in descending order (highest to lowest)
// the code below turns the first letter of a word capitalized 
    // const word = "nati tefera";
    // const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    // console.log(capitalized); 
// num 2 class work
        const str = "nati nati";
        const capitalized = str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        console.log(capitalized); 

// the code below will count only vowels from a word 
        function countVowels(word) {
        const vowels = "aeiouAEIOU";
         let count = 0;
    
        for (let char of word) {
            if (vowels.includes(char)) {
                count++;
            }
        }
    
    return count;
}


console.log(countVowels("Abenezer")); 

// the code below will find the second largest number in an arry

   
    const scores = [10, 45, 2, 89, 23, 99];
    function SecondLargest(numbers) {
    numbers.sort((a, b) => b - a);
    return numbers[1];
}
    console.log(SecondLargest(scores)); 

//  the code below will remove the falsy value form an arry

    const trues = ["hi", 20, false]
    const fix = trues.filter(Boolean);

    console.log(fix)